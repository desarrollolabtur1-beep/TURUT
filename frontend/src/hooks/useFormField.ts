/**
 * useFormField — Hook reutilizable para campos de formulario con validación
 *
 * Uso:
 *   const email = useFormField('', (v) => /\S+@\S+/.test(v) ? '' : 'Email inválido');
 *   <TextInput value={email.value} onChangeText={email.onChange} />
 *   {email.error && <Text>{email.error}</Text>}
 */
import { useState, useCallback } from 'react';

type ValidatorFn = (value: string) => string; // retorna mensaje de error o ''

interface FormFieldState {
  value: string;
  error: string;
  touched: boolean;
  onChange: (text: string) => void;
  onBlur: () => void;
  reset: () => void;
  isValid: boolean;
}

export function useFormField(
  initialValue: string = '',
  validator?: ValidatorFn
): FormFieldState {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = useCallback(
    (text: string): string => {
      if (!validator) return '';
      return validator(text);
    },
    [validator]
  );

  const onChange = useCallback(
    (text: string) => {
      setValue(text);
      if (touched) {
        setError(validate(text));
      }
    },
    [touched, validate]
  );

  const onBlur = useCallback(() => {
    setTouched(true);
    setError(validate(value));
  }, [validate, value]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError('');
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    onChange,
    onBlur,
    reset,
    isValid: validate(value) === '',
  };
}
