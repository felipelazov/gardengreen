export const SERVICE_TYPES = [
  { id: 'manutencao', label: 'Manutencao de jardim' },
  { id: 'poda', label: 'Poda de arvores' },
  { id: 'plantio', label: 'Plantio' },
  { id: 'paisagismo', label: 'Paisagismo' },
  { id: 'irrigacao', label: 'Irrigacao' },
  { id: 'limpeza', label: 'Limpeza de terreno' },
  { id: 'gramado', label: 'Corte de gramado' },
  { id: 'adubacao', label: 'Adubacao' },
  { id: 'outro', label: 'Outro' },
] as const;

export type ServiceTypeId = typeof SERVICE_TYPES[number]['id'];
