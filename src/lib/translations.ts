export const translations = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_journal: 'Journal',
    nav_meditate: 'Meditate',
    nav_sounds: 'Sounds',
    nav_dreams: 'Dreams',
    nav_history: 'History',
    nav_upgrade: 'Upgrade',
    nav_profile: 'Profile',
    nav_billing: 'Billing',
    nav_logout: 'Logout',
    my_account: 'My Account',

    // Profile Page
    profile_title: 'Profile & Settings',
    profile_description: 'Manage your account information.',
    profile_form_title: 'Your Information',
    profile_form_description: 'Update your personal details here.',
    profile_username: 'Username',
    profile_username_placeholder: 'Your Name',
    profile_email: 'Email',
    profile_zodiac: 'Zodiac Sign',
    profile_zodiac_placeholder: 'Select your zodiac sign',
    profile_zodiac_description:
      'This is used for personalized affirmations if you are a Pro member.',
    profile_birthdate: 'Birthdate',
    profile_birthdate_placeholder: 'YYYY-MM-DD',
    profile_birthdate_description:
      'Your date of birth is used to enhance affirmation personalization.',
    profile_language: 'Language',
    profile_language_placeholder: 'Select a language',
    profile_save_button: 'Save Changes',
    profile_saving_button: 'Saving...',
    profile_logout_button: 'Logout',
    profile_update_success_title: 'Profile Updated',
    profile_update_success_description: 'Your information has been saved.',
    profile_update_fail_title: 'Update Failed',
    logout_success_title: 'Logged Out',
    logout_success_description: 'You have been successfully logged out.',
  },
  es: {
    // Navigation
    nav_home: 'Inicio',
    nav_journal: 'Diario',
    nav_meditate: 'Meditar',
    nav_sounds: 'Sonidos',
    nav_dreams: 'Sueños',
    nav_history: 'Historial',
    nav_upgrade: 'Mejorar',
    nav_profile: 'Perfil',
    nav_billing: 'Facturación',
    nav_logout: 'Cerrar Sesión',
    my_account: 'Mi Cuenta',

    // Profile Page
    profile_title: 'Perfil y Configuración',
    profile_description: 'Gestiona la información de tu cuenta.',
    profile_form_title: 'Tu Información',
    profile_form_description: 'Actualiza tus datos personales aquí.',
    profile_username: 'Nombre de usuario',
    profile_username_placeholder: 'Tu Nombre',
    profile_email: 'Correo Electrónico',
    profile_zodiac: 'Signo del Zodiaco',
    profile_zodiac_placeholder: 'Selecciona tu signo del zodiaco',
    profile_zodiac_description:
      'Se utiliza para afirmaciones personalizadas si eres miembro Pro.',
    profile_birthdate: 'Fecha de Nacimiento',
    profile_birthdate_placeholder: 'AAAA-MM-DD',
    profile_birthdate_description:
      'Tu fecha de nacimiento se usa para mejorar la personalización de las afirmaciones.',
    profile_language: 'Idioma',
    profile_language_placeholder: 'Selecciona un idioma',
    profile_save_button: 'Guardar Cambios',
    profile_saving_button: 'Guardando...',
    profile_logout_button: 'Cerrar Sesión',
    profile_update_success_title: 'Perfil Actualizado',
    profile_update_success_description: 'Tu información ha sido guardada.',
    profile_update_fail_title: 'Falló la Actualización',
    logout_success_title: 'Sesión Cerrada',
    logout_success_description: 'Has cerrado sesión exitosamente.',
  },
};

export type Translations = typeof translations.en;
export type Language = keyof typeof translations;

export const languages: { key: Language; name: string }[] = [
  { key: 'en', name: 'English' },
  { key: 'es', name: 'Español' },
];
