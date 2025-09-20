export function validateAnswers(questions, answers) {
  const errors = {};
  for (const q of questions) {
    // Conditional display (simple): if q.showIf = { questionId, equals }
    if (q.showIf && q.showIf.questionId) {
      const otherVal = answers[q.showIf.questionId];
      const shouldShow = otherVal === q.showIf.equals;
      if (!shouldShow) continue; // skip validation when hidden
    }
    if (q.required && !answers[q.id]) {
      errors[q.id] = "This field is required";
      continue;
    }
    if (q.type === "shortText" && q.validation?.maxLength) {
      if ((answers[q.id] || "").length > q.validation.maxLength) {
        errors[q.id] = `Must be <= ${q.validation.maxLength} chars`;
      }
    }
    if (q.type === "longText" && q.validation?.maxLength) {
      if ((answers[q.id] || "").length > q.validation.maxLength) {
        errors[q.id] = `Must be <= ${q.validation.maxLength} chars`;
      }
    }
    if (q.type === "numeric") {
      const val = Number(answers[q.id]);
      if (!Number.isNaN(val)) {
        if (q.validation?.min != null && val < q.validation.min) {
          errors[q.id] = `Must be >= ${q.validation.min}`;
        }
        if (q.validation?.max != null && val > q.validation.max) {
          errors[q.id] = `Must be <= ${q.validation.max}`;
        }
      }
    }
  }
  return errors;
}


