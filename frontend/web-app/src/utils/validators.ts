export const validateDocument = (document: string): boolean => {
  const docRegex = /^\d{8,15}$/;
  return docRegex.test(document);
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
  return nameRegex.test(name);
};

export const validateGrade = (grade: string): boolean => {
  const gradeRegex = /^[1-9][0-9]?[A-Za-z]?$/;
  return gradeRegex.test(grade);
};

export const validateGroup = (group: string): boolean => {
  const groupRegex = /^[A-Za-z]{1,3}$/;
  return groupRegex.test(group);
};