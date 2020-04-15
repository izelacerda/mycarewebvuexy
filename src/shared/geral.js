export function dicalogin(nomecompleto) {
  if (nomecompleto) {
    nomecompleto = nomecompleto.replace(/\s(de|da|dos|das)\s/g, " "); // Remove os de,da, dos,das.
    const iniciais = nomecompleto.match(/\b(\w)/gi); // Iniciais de cada parte do nome.
    const nome = nomecompleto.split(" ")[0].toLowerCase(); // Primeiro nome.
    const sobrenomes = iniciais
      .splice(1, iniciais.length - 1)
      .join("")
      .toLowerCase(); // Iniciais
    return (
      nome.substring(0, 1).toLocaleUpperCase() +
      sobrenomes.substring(0, 1).toLocaleUpperCase()
    );
  }
  return null;
}
