export type Locale = 'en' | 'zh';

export const dictionary = {
  en: {
    metadata: {
      title: "Advanced Eye Care Testing",
      description: "Comprehensive online vision testing suite",
    },
    nav: {
      brand: "EyeCare Pro",
      home: "Home",
      about: "About",
    },
    hero: {
      title: "Comprehensive Vision Testing",
      subtitle: "Professional-grade eye tests you can take at home. Based on the latest ophthalmology research standards.",
      start: "Start Testing",
    },
    tests: {
      acuity: {
        title: "Visual Acuity Test",
        description: "Standard E-chart test to measure your visual sharpness.",
      },
      color: {
        title: "Color Blindness",
        description: "Identify numbers in colored plates to detect color deficiencies.",
      },
      sensitivity: {
        title: "Color Sensitivity",
        description: "Test your ability to distinguish subtle color differences.",
      },
      field: {
        title: "Visual Field",
        description: "Check your peripheral vision for blind spots.",
      },
      micro: {
        title: "Micro-Perimetry",
        description: "Detailed assessment of central visual field sensitivity.",
      },
      games: {
        title: "Vision Training Games",
        description: "Gamified exercises to improve acuity and attention (Gabor, MOT).",
      },
    },
    disclaimer: {
      title: "Medical Disclaimer",
      text: "These online tests are for screening and educational purposes only. They are not a replacement for a professional eye examination by a qualified ophthalmologist. If you experience any vision problems, please consult a doctor immediately.",
    },
    footer: {
      copyright: "© 2024 EyeCare Pro. All rights reserved.",
    },
    about: {
      title: "About EyeCare Pro",
      description: "EyeCare Pro uses modern web technologies to bring professional-grade vision screening to your browser. Our tests are based on established ophthalmological standards adapted for digital displays.",
      ourTests: "Our Tests",
      tests: [
        { label: "Visual Acuity:", text: "Based on the Snellen and LogMAR standards, calibrated to your specific screen size." },
        { label: "Color Vision:", text: "Adaptation of the Farnsworth D-15 arrangement test to detect Protan, Deutan, and Tritan defects." },
        { label: "Contrast Sensitivity:", text: "Dynamic testing of color discrimination thresholds." },
        { label: "Perimetry:", text: "Digital simulation of Humphrey Field Analyzer concepts for detecting scotomas (blind spots)." },
      ],
      disclaimerTitle: "Important Disclaimer",
      disclaimerText: "This software is for informational and educational purposes only. It is not a medical device and does not provide a medical diagnosis. Factors such as screen quality, lighting conditions, and calibration accuracy can affect results. Always seek the advice of a physician or other qualified health provider with any questions you may have regarding a medical condition."
    }
  },
  zh: {
    metadata: {
      title: "高级视力测试",
      description: "综合在线视力测试套件",
    },
    nav: {
      brand: "EyeCare Pro",
      home: "首页",
      about: "关于",
    },
    hero: {
      title: "综合视力健康测试",
      subtitle: "基于最新眼科研究标准的专业级家庭视力自测工具。",
      start: "开始测试",
    },
    tests: {
      acuity: {
        title: "视力表测试",
        description: "标准的E字表测试，用于测量您的视力清晰度。",
      },
      color: {
        title: "色盲测试",
        description: "通过识别色图中的数字来检测色觉缺陷。",
      },
      sensitivity: {
        title: "色彩敏感度",
        description: "测试您区分细微颜色差异的能力。",
      },
      field: {
        title: "视野测试",
        description: "检查您的周边视野是否存在盲点。",
      },
      micro: {
        title: "微视野检查",
        description: "对中心视野敏感度的详细评估。",
      },
      games: {
        title: "视觉训练游戏",
        description: "提高视敏度和注意力的游戏化练习 (Gabor, MOT)。",
      },
    },
    disclaimer: {
      title: "医疗免责声明",
      text: "这些在线测试仅用于筛查和教育目的。它们不能替代合格眼科医生的专业眼科检查。如果您遇到任何视力问题，请立即咨询医生。",
    },
    footer: {
      copyright: "© 2024 EyeCare Pro. 保留所有权利。",
    },
    about: {
      title: "关于 EyeCare Pro",
      description: "EyeCare Pro 利用现代网络技术将专业级的视力筛查带到您的浏览器中。我们的测试基于已建立的眼科标准，并针对数字显示器进行了调整。",
      ourTests: "我们的测试",
      tests: [
        { label: "视力清晰度:", text: "基于Snellen和LogMAR标准，针对您的特定屏幕尺寸进行校准。" },
        { label: "色觉:", text: "改编自Farnsworth D-15排列测试，用于检测红色盲、绿色盲和蓝色盲缺陷。" },
        { label: "对比敏感度:", text: "颜色辨别阈值的动态测试。" },
        { label: "视野检查:", text: "数字模拟Humphrey视野分析仪概念，用于检测暗点（盲点）。" },
      ],
      disclaimerTitle: "重要免责声明",
      disclaimerText: "本软件仅供参考和教育用途。它不是医疗设备，也不提供医疗诊断。屏幕质量、光照条件和校准精度等因素可能会影响结果。如有任何关于医疗状况的问题，请务必咨询医生或其他合格的医疗提供者。"
    }
  }
};
