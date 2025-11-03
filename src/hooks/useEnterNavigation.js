import { useCallback } from 'react';

// Hook para navegação com Enter entre campos
export const useEnterNavigation = () => {
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Encontrar o formulário ou container pai
      const form = e.target.closest('form') || 
                   e.target.closest('.payment-details') || 
                   e.target.closest('.section-card') ||
                   e.target.closest('.profile-info');
      
      if (!form) return;
      
      // Buscar todos os inputs e selects focáveis
      const inputs = Array.from(form.querySelectorAll('input:not([disabled]), select:not([disabled])'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      
      if (nextInput) {
        nextInput.focus();
      } else {
        // Se for o último campo, focar no botão de submit/ação
        const submitButton = form.querySelector('button[type="submit"]') ||
                           form.querySelector('.btn-confirm') ||
                           form.querySelector('.edit-btn') ||
                           document.querySelector('.btn-confirm');
        
        if (submitButton && !submitButton.disabled) {
          submitButton.focus();
        }
      }
    }
  }, []);

  return handleKeyPress;
};

export default useEnterNavigation;
