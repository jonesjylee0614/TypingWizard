import { Lesson } from '../types';

export const lessonList: Lesson[] = [
  {
    id: 'l01',
    title: '主键位 ASDF JKL;',
    description: '熟悉主键位左右手位置，为后续课程打基础。',
    content: [
      'a s d f j k l ;',
      'asdf jkl; asdf jkl;'
    ],
    targetAccuracy: 0.9,
    targetWpm: 20
  },
  {
    id: 'l02',
    title: '上排 QWER UIOP',
    description: '练习上排字母，保持手指回到主键位。',
    content: [
      'q w e r u i o p',
      'qwer uiop qwer uiop'
    ],
    targetAccuracy: 0.9,
    targetWpm: 22,
    unlockRule: {
      dependsOn: 'l01',
      minAcc: 0.9
    }
  },
  {
    id: 'l03',
    title: '下排 ZXCV M,./',
    description: '熟悉下排键位，注意左手与右手跨行移动。',
    content: [
      'z x c v m , . /',
      'zxcm ., zxcm .,'
    ],
    targetAccuracy: 0.9,
    targetWpm: 23,
    unlockRule: {
      dependsOn: 'l02',
      minAcc: 0.9
    }
  },
  {
    id: 'l04',
    title: '数字行 1234567890',
    description: '数字输入练习，注意手指跨度。',
    content: [
      '1 2 3 4 5 6 7 8 9 0',
      '12345 67890 12345 67890'
    ],
    targetAccuracy: 0.92,
    targetWpm: 24,
    unlockRule: {
      dependsOn: 'l03',
      minAcc: 0.9
    }
  },
  {
    id: 'l05',
    title: '常用英文单词 I Love Typing',
    description: '将各排组合成常用短句，练习节奏。',
    content: [
      'i love typing very much',
      'practice makes perfect typing'
    ],
    targetAccuracy: 0.93,
    targetWpm: 26,
    unlockRule: {
      dependsOn: 'l04',
      minAcc: 0.92,
      minWpm: 24
    }
  },
  {
    id: 'l06',
    title: '经典英文句子 Pangram',
    description: '综合练习，覆盖全键盘字符。',
    content: [
      'the quick brown fox jumps over the lazy dog',
      'pack my box with five dozen liquor jugs'
    ],
    targetAccuracy: 0.95,
    targetWpm: 28,
    unlockRule: {
      dependsOn: 'l05',
      minAcc: 0.93,
      minWpm: 26
    }
  }
];

export const lessonMap = Object.fromEntries(lessonList.map((lesson) => [lesson.id, lesson]));
