import { Link } from 'react-router-dom';
import InputField from './InputField';

function TermsAndSubmit({ formData, onChange, errors }) {
  return (
    <InputField
      type="checkbox"
      name="termosAceitos"
      label={
        <>
          Aceito os{' '}
          <Link to="/terms" className="text-yellow-500 hover:underline">
            Termos e Condições
          </Link>
        </>
      }
      checked={formData.termosAceitos}
      onChange={onChange}
      error={errors.termosAceitos}
      className="flex items-center space-x-2"
    />
  );
}

export default TermsAndSubmit;
