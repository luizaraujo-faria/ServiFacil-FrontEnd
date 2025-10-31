import InputField from './InputField';

function PersonalInfoForm({ formData, onChange, errors }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Nome" name="nome" value={formData.nome} onChange={onChange} placeholder="Digite seu nome" error={errors.nome} />

      <InputField
        label="CPF"
        name="cpf"
        value={formData.cpf}
        onChange={(e) => {
          // permite apenas números
          const onlyNumbers = e.target.value.replace(/\D/g, '');
          onChange({ target: { name: 'cpf', value: onlyNumbers } });
        }}
        placeholder="000.000.000-00"
        error={errors.cpf}
      />

      <InputField type="date" label="Data de Nascimento" name="dataNascimento" value={formData.dataNascimento} onChange={onChange} error={errors.dataNascimento} />

      <InputField type="email" label="E-mail" name="email" value={formData.email} onChange={onChange} placeholder="exemplo@email.com" error={errors.email} />
    </div>
  );
}

export default PersonalInfoForm;
