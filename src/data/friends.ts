export interface FriendGreeting {
  name: string
  message: string
  signoff: string
  icon: string
  theme: string
}

export const friendGreetings: FriendGreeting[] = [
  {
    name: 'Bhumi Krishnani',
    message: 'May your enthusiasm stay a constant, your passion never run out of memory, and every new challenge become a chance to level up. Keep inheriting new skills, overriding limits, and deploying your dreams into reality.',
    signoff: 'Keep coding, keep growing, and never lose that spark!',
    icon: '🚀',
    theme: 'enthusiastic developer',
  },
  {
    name: 'Chaitali Parmar',
    message: 'May life capture your happiest moments in high resolution, keep your memories safely stored, and never blur your beautiful dreams. May every new chapter bring a perfect frame of happiness and a lovely new perspective.',
    signoff: 'Keep clicking, keep creating, and keep shining!',
    icon: '📸',
    theme: 'creative photographer',
  },
  {
    name: 'Hetvi',
    message: 'May kindness always be your default setting, humility your inherited quality, and friendship your most valuable object. May you make everyone’s life a little brighter just by being wonderfully you.',
    signoff: 'Stay humble, stay friendly, and keep that beautiful heart.',
    icon: '💗',
    theme: 'friendly, humble soul',
  },
  {
    name: 'Hinanshi Rushi',
    message: 'May your peaceful nature stay perfectly encapsulated, while your mischievous side keeps surprising everyone. May happiness never throw exceptions, confidence stay in execution, and life remain free of unnecessary bugs.',
    signoff: 'Quiet by default, mischievous by design!',
    icon: '😈',
    theme: 'quiet soul with a playful side',
  },
  {
    name: 'Ruturaj Vaghela',
    message: 'May your dreams scale infinitely, your opportunities bring wonderful returns, and every decision compile with success. May you always balance ambition with kindness and success with friendship.',
    signoff: 'Wishing you unlimited growth and a lifetime of happiness!',
    icon: '💼',
    theme: 'business-minded developer',
  },
  {
    name: 'Harsh Ahire',
    message: 'May friendship always be your strongest interface, kindness your default behaviour, and happiness a feature that never gets deprecated. May life deliver fewer bugs, more surprises, and success without interruption.',
    signoff: 'Stay friendly, keep smiling, and spread those positive vibes!',
    icon: '😎',
    theme: 'friendly developer',
  },
  {
    name: 'Billal Khan',
    message: 'May your heart stay an infinite source of love, your kindness never hit a memory limit, and your care for others return to you as happiness. May life multiply all the goodness you give into countless blessings.',
    signoff: 'Never stop making people feel loved, valued, and cared for.',
    icon: '❤️',
    theme: 'caring and loving soul',
  },
  {
    name: 'Tahaa Mandsorwala',
    message: 'May your strength keep increasing, your discipline never experience downtime, and your determination outperform every limit. Keep debugging weaknesses, overriding excuses, and upgrading yourself every day.',
    signoff: 'No pain, no gain, no bugs, only upgrades!',
    icon: '💪',
    theme: 'fitness enthusiast',
  },
  {
    name: 'Mohib Shaikh',
    message: 'May your curiosity never run out of queries, your mind keep discovering new possibilities, and your kindness remain an infinite resource. May every challenge unlock an opportunity and every friendship become a lasting connection.',
    signoff: 'Stay curious, keep exploring, and never stop caring!',
    icon: '🔍',
    theme: 'curious and caring developer',
  },
  {
    name: 'Het Pagi',
    message: 'May your life follow clean logic, your decisions have zero unnecessary exceptions, and your ambitions scale beyond expectations. Keep optimizing opportunities and investing in what truly matters.',
    signoff: 'Think smart, dream big, and remember to enjoy the moment!',
    icon: '🧠',
    theme: 'rational, big-picture thinker',
  },
]

export function getFriendGreeting(name: string): FriendGreeting | undefined {
  const normalizedName = name.trim().replace(/\s+/g, ' ').toLowerCase()
  const exactMatch = friendGreetings.find((friend) => friend.name.toLowerCase() === normalizedName)
  if (exactMatch) return exactMatch

  const firstNameMatch = friendGreetings.find((friend) => {
    const firstName = friend.name.split(' ')[0].toLowerCase()
    return firstName === normalizedName
  })
  if (firstNameMatch) return firstNameMatch

  return friendGreetings.find((friend) => {
    const friendName = friend.name.toLowerCase()
    return !friendName.includes(' ') && normalizedName.startsWith(`${friendName} `)
  })
}
