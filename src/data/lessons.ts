import { Lesson } from '../types';
import { 
  generateWordSequence, 
  generateMixedWordSequence,
  getRandomItems,
  getRandomItem,
  commonWords,
  classicSentences,
  motivationalSentences,
  simplePhrases
} from './wordbank';

// 动态生成课程内容的函数
export const generateLessonContent = (lessonId: string): string[] => {
  const seed = Date.now(); // 使用时间戳作为随机种子，确保每次进入都不同
  
  switch (lessonId) {
    // 第1-5关：基础键位练习
    case 'l01':
      return ['asdf jkl;', 'asdf jkl; asdf jkl;', 'aaa sss ddd fff jjj kkk lll ;;;'];
    case 'l02':
      return ['qwer uiop', 'qwer uiop qwer uiop', 'qqq www eee rrr uuu iii ooo ppp'];
    case 'l03':
      return ['zxcv nm,.', 'zxcv nm,. zxcv nm,.', 'zzz xxx ccc vvv nnn mmm ,,, ...'];
    case 'l04':
      return ['tygh bnui', 'tygh bnui tygh bnui', 'ttt yyy ggg hhh bbb nnn uuu iii'];
    case 'l05':
      return ['1234567890', '12345 67890', '111 222 333 444 555 666 777 888 999 000'];
    
    // 第6-10关：简单单词
    case 'l06':
    case 'l07':
    case 'l08':
    case 'l09':
    case 'l10':
      return getRandomItems(simplePhrases, 3);
    
    // 第11-20关：常用单词（简单）
    case 'l11':
    case 'l12':
    case 'l13':
    case 'l14':
    case 'l15':
    case 'l16':
    case 'l17':
    case 'l18':
    case 'l19':
    case 'l20':
      return [
        generateWordSequence('easy', 10),
        generateWordSequence('easy', 12),
        getRandomItem(simplePhrases)
      ];
    
    // 第21-30关：常用单词（中等）
    case 'l21':
    case 'l22':
    case 'l23':
    case 'l24':
    case 'l25':
    case 'l26':
    case 'l27':
    case 'l28':
    case 'l29':
    case 'l30':
      return [
        generateWordSequence('medium', 10),
        generateWordSequence('medium', 12),
        getRandomItem(motivationalSentences)
      ];
    
    // 第31-40关：常用单词（困难）+ 经典句子
    case 'l31':
    case 'l32':
    case 'l33':
    case 'l34':
    case 'l35':
    case 'l36':
    case 'l37':
    case 'l38':
    case 'l39':
    case 'l40':
      return [
        generateWordSequence('hard', 10),
        getRandomItem(classicSentences),
        getRandomItem(motivationalSentences)
      ];
    
    // 第41-50关：综合练习
    case 'l41':
    case 'l42':
    case 'l43':
    case 'l44':
    case 'l45':
    case 'l46':
    case 'l47':
    case 'l48':
    case 'l49':
    case 'l50':
      return [
        generateMixedWordSequence(15),
        getRandomItem(classicSentences),
        getRandomItem(motivationalSentences),
        generateWordSequence('hard', 10)
      ];
    
    default:
      return ['hello world'];
  }
};

// 静态课程定义（50关）
export const lessonList: Lesson[] = [
  // 第1-5关：基础键位
  { id: 'l01', title: '第1关 - 主键位 ASDF JKL;', description: '熟悉主键位，打好基础', content: [], targetAccuracy: 0.85, targetWpm: 15 },
  { id: 'l02', title: '第2关 - 上排 QWER UIOP', description: '练习上排字母', content: [], targetAccuracy: 0.85, targetWpm: 16, unlockRule: { dependsOn: 'l01', minAcc: 0.85 } },
  { id: 'l03', title: '第3关 - 下排 ZXCV NM,.', description: '熟悉下排键位', content: [], targetAccuracy: 0.85, targetWpm: 17, unlockRule: { dependsOn: 'l02', minAcc: 0.85 } },
  { id: 'l04', title: '第4关 - 中间键 TYGH BNUI', description: '练习中间区域的字母', content: [], targetAccuracy: 0.85, targetWpm: 18, unlockRule: { dependsOn: 'l03', minAcc: 0.85 } },
  { id: 'l05', title: '第5关 - 数字行 0-9', description: '数字输入练习', content: [], targetAccuracy: 0.88, targetWpm: 19, unlockRule: { dependsOn: 'l04', minAcc: 0.85 } },
  
  // 第6-10关：简单短语
  { id: 'l06', title: '第6关 - 简单短语 I', description: '开始练习简单的英文短语', content: [], targetAccuracy: 0.88, targetWpm: 20, unlockRule: { dependsOn: 'l05', minAcc: 0.88 } },
  { id: 'l07', title: '第7关 - 简单短语 II', description: '继续练习常用短语', content: [], targetAccuracy: 0.88, targetWpm: 21, unlockRule: { dependsOn: 'l06', minAcc: 0.88 } },
  { id: 'l08', title: '第8关 - 简单短语 III', description: '巩固短语打字技能', content: [], targetAccuracy: 0.88, targetWpm: 22, unlockRule: { dependsOn: 'l07', minAcc: 0.88 } },
  { id: 'l09', title: '第9关 - 简单短语 IV', description: '提升短语输入速度', content: [], targetAccuracy: 0.9, targetWpm: 23, unlockRule: { dependsOn: 'l08', minAcc: 0.88 } },
  { id: 'l10', title: '第10关 - 简单短语 V', description: '完成短语基础训练', content: [], targetAccuracy: 0.9, targetWpm: 24, unlockRule: { dependsOn: 'l09', minAcc: 0.9 } },
  
  // 第11-20关：常用单词（简单）
  { id: 'l11', title: '第11关 - 常用词汇 I', description: '学习最常用的英文单词', content: [], targetAccuracy: 0.9, targetWpm: 25, unlockRule: { dependsOn: 'l10', minAcc: 0.9, minWpm: 24 } },
  { id: 'l12', title: '第12关 - 常用词汇 II', description: '继续积累词汇量', content: [], targetAccuracy: 0.9, targetWpm: 26, unlockRule: { dependsOn: 'l11', minAcc: 0.9 } },
  { id: 'l13', title: '第13关 - 常用词汇 III', description: '熟练掌握基础词汇', content: [], targetAccuracy: 0.9, targetWpm: 27, unlockRule: { dependsOn: 'l12', minAcc: 0.9 } },
  { id: 'l14', title: '第14关 - 常用词汇 IV', description: '提高词汇输入速度', content: [], targetAccuracy: 0.92, targetWpm: 28, unlockRule: { dependsOn: 'l13', minAcc: 0.9 } },
  { id: 'l15', title: '第15关 - 常用词汇 V', description: '巩固词汇训练', content: [], targetAccuracy: 0.92, targetWpm: 29, unlockRule: { dependsOn: 'l14', minAcc: 0.92 } },
  { id: 'l16', title: '第16关 - 常用词汇 VI', description: '扩展词汇练习', content: [], targetAccuracy: 0.92, targetWpm: 30, unlockRule: { dependsOn: 'l15', minAcc: 0.92 } },
  { id: 'l17', title: '第17关 - 常用词汇 VII', description: '提升打字流畅度', content: [], targetAccuracy: 0.92, targetWpm: 31, unlockRule: { dependsOn: 'l16', minAcc: 0.92 } },
  { id: 'l18', title: '第18关 - 常用词汇 VIII', description: '加快输入节奏', content: [], targetAccuracy: 0.92, targetWpm: 32, unlockRule: { dependsOn: 'l17', minAcc: 0.92 } },
  { id: 'l19', title: '第19关 - 常用词汇 IX', description: '熟练运用词汇', content: [], targetAccuracy: 0.93, targetWpm: 33, unlockRule: { dependsOn: 'l18', minAcc: 0.92 } },
  { id: 'l20', title: '第20关 - 常用词汇 X', description: '完成基础词汇阶段', content: [], targetAccuracy: 0.93, targetWpm: 34, unlockRule: { dependsOn: 'l19', minAcc: 0.93, minWpm: 33 } },
  
  // 第21-30关：常用单词（中等）
  { id: 'l21', title: '第21关 - 进阶词汇 I', description: '挑战中等难度词汇', content: [], targetAccuracy: 0.93, targetWpm: 35, unlockRule: { dependsOn: 'l20', minAcc: 0.93, minWpm: 34 } },
  { id: 'l22', title: '第22关 - 进阶词汇 II', description: '提升词汇难度', content: [], targetAccuracy: 0.93, targetWpm: 36, unlockRule: { dependsOn: 'l21', minAcc: 0.93 } },
  { id: 'l23', title: '第23关 - 进阶词汇 III', description: '加强复杂单词练习', content: [], targetAccuracy: 0.93, targetWpm: 37, unlockRule: { dependsOn: 'l22', minAcc: 0.93 } },
  { id: 'l24', title: '第24关 - 进阶词汇 IV', description: '掌握中级词汇', content: [], targetAccuracy: 0.94, targetWpm: 38, unlockRule: { dependsOn: 'l23', minAcc: 0.93 } },
  { id: 'l25', title: '第25关 - 进阶词汇 V', description: '流畅输入中级词汇', content: [], targetAccuracy: 0.94, targetWpm: 39, unlockRule: { dependsOn: 'l24', minAcc: 0.94 } },
  { id: 'l26', title: '第26关 - 进阶词汇 VI', description: '提速进阶训练', content: [], targetAccuracy: 0.94, targetWpm: 40, unlockRule: { dependsOn: 'l25', minAcc: 0.94 } },
  { id: 'l27', title: '第27关 - 进阶词汇 VII', description: '巩固进阶技能', content: [], targetAccuracy: 0.94, targetWpm: 41, unlockRule: { dependsOn: 'l26', minAcc: 0.94 } },
  { id: 'l28', title: '第28关 - 进阶词汇 VIII', description: '加速中级练习', content: [], targetAccuracy: 0.94, targetWpm: 42, unlockRule: { dependsOn: 'l27', minAcc: 0.94 } },
  { id: 'l29', title: '第29关 - 进阶词汇 IX', description: '熟练运用进阶词汇', content: [], targetAccuracy: 0.95, targetWpm: 43, unlockRule: { dependsOn: 'l28', minAcc: 0.94 } },
  { id: 'l30', title: '第30关 - 进阶词汇 X', description: '完成进阶词汇训练', content: [], targetAccuracy: 0.95, targetWpm: 44, unlockRule: { dependsOn: 'l29', minAcc: 0.95, minWpm: 43 } },
  
  // 第31-40关：困难单词 + 经典句子
  { id: 'l31', title: '第31关 - 高级词汇 I', description: '挑战高级难度词汇', content: [], targetAccuracy: 0.95, targetWpm: 45, unlockRule: { dependsOn: 'l30', minAcc: 0.95, minWpm: 44 } },
  { id: 'l32', title: '第32关 - 高级词汇 II', description: '掌握复杂词汇', content: [], targetAccuracy: 0.95, targetWpm: 46, unlockRule: { dependsOn: 'l31', minAcc: 0.95 } },
  { id: 'l33', title: '第33关 - 经典句子 I', description: '练习完整句子输入', content: [], targetAccuracy: 0.95, targetWpm: 47, unlockRule: { dependsOn: 'l32', minAcc: 0.95 } },
  { id: 'l34', title: '第34关 - 经典句子 II', description: '提升句子输入速度', content: [], targetAccuracy: 0.95, targetWpm: 48, unlockRule: { dependsOn: 'l33', minAcc: 0.95 } },
  { id: 'l35', title: '第35关 - 经典句子 III', description: '流畅输入长句子', content: [], targetAccuracy: 0.96, targetWpm: 49, unlockRule: { dependsOn: 'l34', minAcc: 0.95 } },
  { id: 'l36', title: '第36关 - 高级词汇 III', description: '综合运用高级词汇', content: [], targetAccuracy: 0.96, targetWpm: 50, unlockRule: { dependsOn: 'l35', minAcc: 0.96 } },
  { id: 'l37', title: '第37关 - 经典句子 IV', description: '掌握句子输入技巧', content: [], targetAccuracy: 0.96, targetWpm: 51, unlockRule: { dependsOn: 'l36', minAcc: 0.96 } },
  { id: 'l38', title: '第38关 - 经典句子 V', description: '提高句子准确度', content: [], targetAccuracy: 0.96, targetWpm: 52, unlockRule: { dependsOn: 'l37', minAcc: 0.96 } },
  { id: 'l39', title: '第39关 - 高级挑战 I', description: '综合高级训练', content: [], targetAccuracy: 0.96, targetWpm: 53, unlockRule: { dependsOn: 'l38', minAcc: 0.96 } },
  { id: 'l40', title: '第40关 - 高级挑战 II', description: '完成高级阶段', content: [], targetAccuracy: 0.97, targetWpm: 54, unlockRule: { dependsOn: 'l39', minAcc: 0.96, minWpm: 53 } },
  
  // 第41-50关：综合大师级
  { id: 'l41', title: '第41关 - 大师挑战 I', description: '冲刺大师级打字', content: [], targetAccuracy: 0.97, targetWpm: 55, unlockRule: { dependsOn: 'l40', minAcc: 0.97, minWpm: 54 } },
  { id: 'l42', title: '第42关 - 大师挑战 II', description: '提升大师级技能', content: [], targetAccuracy: 0.97, targetWpm: 56, unlockRule: { dependsOn: 'l41', minAcc: 0.97 } },
  { id: 'l43', title: '第43关 - 大师挑战 III', description: '精通高速输入', content: [], targetAccuracy: 0.97, targetWpm: 57, unlockRule: { dependsOn: 'l42', minAcc: 0.97 } },
  { id: 'l44', title: '第44关 - 大师挑战 IV', description: '追求极致速度', content: [], targetAccuracy: 0.97, targetWpm: 58, unlockRule: { dependsOn: 'l43', minAcc: 0.97 } },
  { id: 'l45', title: '第45关 - 大师挑战 V', description: '突破速度极限', content: [], targetAccuracy: 0.98, targetWpm: 59, unlockRule: { dependsOn: 'l44', minAcc: 0.97 } },
  { id: 'l46', title: '第46关 - 终极挑战 I', description: '挑战终极难度', content: [], targetAccuracy: 0.98, targetWpm: 60, unlockRule: { dependsOn: 'l45', minAcc: 0.98 } },
  { id: 'l47', title: '第47关 - 终极挑战 II', description: '完美打字技巧', content: [], targetAccuracy: 0.98, targetWpm: 61, unlockRule: { dependsOn: 'l46', minAcc: 0.98 } },
  { id: 'l48', title: '第48关 - 终极挑战 III', description: '顶级打字速度', content: [], targetAccuracy: 0.98, targetWpm: 62, unlockRule: { dependsOn: 'l47', minAcc: 0.98 } },
  { id: 'l49', title: '第49关 - 终极挑战 IV', description: '巅峰打字水平', content: [], targetAccuracy: 0.99, targetWpm: 63, unlockRule: { dependsOn: 'l48', minAcc: 0.98 } },
  { id: 'l50', title: '第50关 - 打字大师', description: '恭喜你成为打字大师！', content: [], targetAccuracy: 0.99, targetWpm: 65, unlockRule: { dependsOn: 'l49', minAcc: 0.99, minWpm: 63 } }
];

// 在访问课程内容时动态生成
export const getLessonWithContent = (lessonId: string): Lesson | undefined => {
  const lesson = lessonList.find(l => l.id === lessonId);
  if (!lesson) return undefined;
  
  return {
    ...lesson,
    content: generateLessonContent(lessonId)
  };
};

export const lessonMap = Object.fromEntries(
  lessonList.map((lesson) => [
    lesson.id, 
    { ...lesson, content: generateLessonContent(lesson.id) }
  ])
);
