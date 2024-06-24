import { scenarioInfo1, scenarioInfo2, scenarioInfo3 } from '@/constants/scenario';

export const getScenarioInfo = (type: number) => {
  switch (type) {
    case 1:
      return scenarioInfo1;
    case 2:
      return scenarioInfo2;
    case 3:
      return scenarioInfo3;
    default:
      return scenarioInfo1;
  }
};

export const isTokenApproval = (type: number) => {
  if (type === 3) return true;
  return false;
};
