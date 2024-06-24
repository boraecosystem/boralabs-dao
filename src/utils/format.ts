import { useNow } from '@vueuse/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { computed } from 'vue';

export const truncate = (text: string, num = 6): string => {
  const characters: number = text.length;
  if (characters >= 42) {
    return text.slice(0, num) + '...' + text.substring(characters - num);
  } else {
    return text;
  }
};

dayjs.extend(utc);
export const formatDate = (
  date: string | Date | dayjs.Dayjs,
  showUTC = true,
  format = 'MMM-DD-YYYY HH:mm'
): string => {
  let newDate = dayjs.utc(date).format(format);
  if (showUTC) newDate += ' (UTC)';
  return newDate;
};

export const calculateVotingPeriod = (min = 5) => {
  const now = useNow();
  const calculatedStartTime = computed(() => formatDate(now.value));
  const calculatedEndTime = computed(() => formatDate(dayjs(now.value).add(min, 'minute')));

  return {
    calculatedStartTime,
    calculatedEndTime
  };
};
