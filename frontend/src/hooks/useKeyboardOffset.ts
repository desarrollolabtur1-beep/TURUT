/**
 * useKeyboardOffset — Hook que expone el offset del teclado virtual
 *
 * En React Native, cuando el teclado aparece desplaza la UI.
 * Este hook retorna un valor numérico que puedes usar en `paddingBottom`
 * o en `KeyboardAvoidingView` para animar tu layout suavemente.
 *
 * Uso:
 *   const keyboardOffset = useKeyboardOffset();
 *   <View style={{ paddingBottom: keyboardOffset }} />
 */
import { useEffect, useState } from 'react';
import { Keyboard, Platform, KeyboardEvent } from 'react-native';

export function useKeyboardOffset(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // En web el teclado no desplaza el layout de la misma manera
    if (Platform.OS === 'web') return;

    const showSub = Keyboard.addListener(
      'keyboardDidShow',
      (e: KeyboardEvent) => {
        setOffset(e.endCoordinates.height);
      }
    );

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setOffset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return offset;
}
