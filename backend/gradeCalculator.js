
function calculateGrades(marksArray) {
  if (!Array.isArray(marksArray) || marksArray.length === 0) {
    return { total: 0, average: 0, grade: 'N/A' };
  }

  const total = marksArray.reduce((s, item) => s + Number(item.marks || 0), 0);
  const average = total / marksArray.length;

  let grade;
  if (average >= 90) grade = 'A+';
  else if (average >= 80) grade = 'A';
  else if (average >= 70) grade = 'B';
  else if (average >= 60) grade = 'C';
  else grade = 'F';

  return { total, average: Number(average.toFixed(2)), grade };
}

module.exports = calculateGrades;
