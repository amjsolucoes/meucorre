import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    Animated,
    PanResponder,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOAST_CONFIG = {
  success: {
    icon: 'checkmark-circle' as const,
    color: '#7BC67A',
    bg: 'rgba(13,79,92,0.97)',
    border: '#7BC67A',
  },
  error: {
    icon: 'close-circle' as const,
    color: '#E05555',
    bg: 'rgba(30,10,10,0.96)',
    border: '#E05555',
  },
  info: {
    icon: 'information-circle' as const,
    color: '#7BC67A',
    bg: 'rgba(13,79,92,0.97)',
    border: '#7BC67A',
  },
  warning: {
    icon: 'warning' as const,
    color: '#F0A500',
    bg: 'rgba(20,16,5,0.97)',
    border: '#F0A500',
  },
};

const DISMISS_THRESHOLD = -40; // px para cima para fechar
const AUTO_DISMISS_MS   = 3600;
const PROGRESS_MS       = 3500;

export const ToastNotification: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    visible, type, title, message, hideAlert,
    onConfirm, showCancel, onCancel, cancelText, confirmText,
  } = useUIStore();

  const translateY  = useRef(new Animated.Value(-140)).current;
  const opacity     = useRef(new Animated.Value(0)).current;
  const scaleX      = useRef(new Animated.Value(0)).current;
  const dragY       = useRef(new Animated.Value(0)).current;
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging  = useRef(false);

  const config        = TOAST_CONFIG[type] || TOAST_CONFIG.info;
  const isConfirmDialog = showCancel;

  // ── dismiss animation ────────────────────────────────────────────────────
  const dismiss = useCallback((toY = -140) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.parallel([
      Animated.timing(translateY, { toValue: toY, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity,    { toValue: 0,   duration: 180, useNativeDriver: true }),
    ]).start(() => {
      dragY.setValue(0);
      hideAlert();
    });
  }, [translateY, opacity, dragY, hideAlert]);

  // ── swipe-up pan responder ───────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,

      onPanResponderGrant: () => {
        isDragging.current = true;
        // pausa o timer enquanto arrasta
        if (timerRef.current) clearTimeout(timerRef.current);
      },

      onPanResponderMove: (_, g) => {
        // só permite arrastar para cima (dy negativo)
        if (g.dy < 0) dragY.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        isDragging.current = false;
        if (g.dy < DISMISS_THRESHOLD || g.vy < -0.5) {
          // velocidade ou distância suficiente → fecha
          dismiss(-200);
        } else {
          // volta para posição original com mola
          Animated.spring(dragY, {
            toValue: 0,
            tension: 120,
            friction: 8,
            useNativeDriver: true,
          }).start();
          // retoma o timer se não for dialog
          if (!isConfirmDialog) {
            timerRef.current = setTimeout(() => dismiss(), AUTO_DISMISS_MS);
          }
        }
      },
    })
  ).current;

  // ── entrada / saída ──────────────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      dragY.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (!isConfirmDialog) {
        scaleX.setValue(0);
        Animated.timing(scaleX, {
          toValue: 1,
          duration: PROGRESS_MS,
          useNativeDriver: true,
        }).start();

        timerRef.current = setTimeout(() => dismiss(), AUTO_DISMISS_MS);
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }
    } else {
      translateY.setValue(-140);
      opacity.setValue(0);
      dragY.setValue(0);
    }
  }, [visible, dismiss, dragY, isConfirmDialog, opacity, scaleX, translateY]);

  const handleConfirm = () => {
    dismiss();
    setTimeout(() => onConfirm?.(), 300);
  };

  const handleCancel = () => {
    dismiss();
    setTimeout(() => onCancel?.(), 300);
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingTop: insets.top + 8,
        paddingHorizontal: 16,
        transform: [
          { translateY: Animated.add(translateY, dragY) },
        ],
        opacity,
      }}
      {...panResponder.panHandlers}
    >
      <View
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={{
          backgroundColor: config.bg,
          borderRadius: 20,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
          elevation: 20,
          borderWidth: 1,
          borderColor: `${config.color}30`,
          overflow: 'hidden',
        }}
      >
        {/* Barra lateral colorida */}
        <View
          style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: 4,
            backgroundColor: config.color,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        />

        {/* Indicador de swipe */}
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <View
            style={{
              width: 32, height: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.25)',
            }}
          />
        </View>

        {/* Conteúdo */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 8 }}>
          <Ionicons
            name={config.icon}
            size={22}
            color={config.color}
            style={{ marginRight: 12, marginTop: 1 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 }}>
              {title}
            </Text>
            {!!message && (
              <Text style={{ fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.7)', marginTop: 3, lineHeight: 18 }}>
                {message}
              </Text>
            )}
          </View>
          {!isConfirmDialog && (
            <TouchableOpacity
              onPress={() => dismiss()}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
              accessibilityLabel="Fechar notificação"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={18} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Botões do dialog de confirmação */}
        {isConfirmDialog && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, paddingLeft: 8 }}>
            <TouchableOpacity
              onPress={handleCancel}
              accessibilityLabel={cancelText || 'Cancelar'}
              accessibilityRole="button"
              style={{
                flex: 1, paddingVertical: 10, borderRadius: 12,
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.6)' }}>
                {cancelText || 'Cancelar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              accessibilityLabel={confirmText || 'Confirmar'}
              accessibilityRole="button"
              style={{
                flex: 1, paddingVertical: 10, borderRadius: 12,
                alignItems: 'center',
                backgroundColor: config.color,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#FFFFFF' }}>
                {confirmText || 'Confirmar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Barra de progresso (auto-dismiss) */}
        {!isConfirmDialog && (
          <View
            style={{
              height: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: 1,
              marginTop: 12,
              marginLeft: 8,
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                height: '100%',
                backgroundColor: config.color,
                borderRadius: 1,
                transform: [{ scaleX }],
                transformOrigin: 'left',
              }}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};
