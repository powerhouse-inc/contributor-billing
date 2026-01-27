import type { ResourceTemplateFaqManagementOperations } from "resourceServices/document-models/resource-template";

export const resourceTemplateFaqManagementOperations: ResourceTemplateFaqManagementOperations =
  {
    addFaqItemOperation(state, action) {
      state.faqs.push({
        id: action.input.id,
        question: action.input.question,
        answer: action.input.answer,
        displayOrder: action.input.displayOrder || null,
      });
      state.lastModified = action.input.lastModified;
    },
    updateFaqItemOperation(state, action) {
      const faqItem = state.faqs.find((f) => f.id === action.input.id);
      if (faqItem) {
        if (action.input.question) {
          faqItem.question = action.input.question;
        }
        if (action.input.answer) {
          faqItem.answer = action.input.answer;
        }
        if (
          action.input.displayOrder !== undefined &&
          action.input.displayOrder !== null
        ) {
          faqItem.displayOrder = action.input.displayOrder;
        }
      }
      state.lastModified = action.input.lastModified;
    },
    deleteFaqItemOperation(state, action) {
      const faqIndex = state.faqs.findIndex((f) => f.id === action.input.id);
      if (faqIndex !== -1) {
        state.faqs.splice(faqIndex, 1);
      }
      state.lastModified = action.input.lastModified;
    },
    reorderFaqItemsOperation(state, action) {
      action.input.faqIds.forEach((faqId, index) => {
        const faqItem = state.faqs.find((f) => f.id === faqId);
        if (faqItem) {
          faqItem.displayOrder = index;
        }
      });
      state.lastModified = action.input.lastModified;
    },
  };
