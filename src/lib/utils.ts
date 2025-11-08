import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(birthDateString: string): number | null {
  if (!birthDateString) return null;
  
  // Adiciona 'T00:00:00' para evitar problemas de fuso horário que podem alterar o dia
  const birthDate = new Date(`${birthDateString}T00:00:00`);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function formatBrazilianDate(dateString: string | Date): string {
  if (!dateString) return '';
  try {
    // Garante que strings no formato 'YYYY-MM-DD' sejam interpretadas em UTC para evitar problemas de fuso horário.
    const date = typeof dateString === 'string' ? new Date(`${dateString}T00:00:00`) : dateString;
    if (isNaN(date.getTime())) return '';
    
    // Formata para dd/mm/aaaa
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return String(dateString); // Retorna o valor original em caso de erro
  }
}