const digitsOnly = (value: string): string => String(value || "").replace(/\D/g, "");

export const normalizePhone = (value = ""): string => {
  const digits = digitsOnly(value);
  if (!digits) return "";
  if (digits.length > 11 && digits.startsWith("55")) return digits.slice(-11);
  return digits;
};

export const normalizeCpf = (value = ""): string => digitsOnly(value).slice(0, 11);

export const isValidCpf = (value = ""): boolean => {
  const cpf = normalizeCpf(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);

  const calculateDigit = (sliceLength: number) => {
    const total = digits
      .slice(0, sliceLength)
      .reduce((sum, digit, index) => sum + digit * (sliceLength + 1 - index), 0);

    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(9) === digits[9] && calculateDigit(10) === digits[10];
};

export const normalizeEmail = (value = ""): string =>
  String(value || "").trim().toLowerCase();
