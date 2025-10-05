function DisponibilidadeForm({ formData, onChange }) {
  const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const toggleDia = (dia) => {
    const diasSelecionados = formData.disponibilidade || [];
    let updated;
    if (diasSelecionados.includes(dia)) {
      updated = diasSelecionados.filter((d) => d !== dia);
    } else {
      updated = [...diasSelecionados, dia];
    }
    onChange({ target: { name: 'disponibilidade', value: updated } });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {dias.map((dia) => (
        <button key={dia} type="button" className={`px-3 py-1 rounded-lg border ${formData.disponibilidade?.includes(dia) ? 'bg-yellow-400 text-white' : 'bg-white text-black'}`} onClick={() => toggleDia(dia)}>
          {dia}
        </button>
      ))}
    </div>
  );
}

export default DisponibilidadeForm;
