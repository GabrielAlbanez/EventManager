import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Autentica o usuário com biometria se estiver ativada.
 * @param biometricEnabled - Indica se o uso de biometria está ativado nas configurações do usuário.
 * @returns true se autenticado com sucesso, false caso contrário.
 */
export const authenticateWithBiometrics = async (biometricEnabled: boolean): Promise<boolean> => {
  try {
    if (!biometricEnabled) return false;

    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return false;

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirme com sua digital',
      fallbackLabel: 'Usar senha',
    });

    return result.success;
  } catch (error) {
    console.warn('Erro na autenticação biométrica:', error);
    return false;
  }
};
