export enum TaskTabType {
  Scheduled = 'scheduled',
  Executed = 'executed'
}

export const TASK_TAB_TYPES = [
  {
    label: '已定时',
    value: TaskTabType.Scheduled
  },
  {
    label: '已完成',
    value: TaskTabType.Executed
  }
]

export enum PlanType {
  NoRepeat = 'no-repeat',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly'
}
export const PLAN_TYPES = [
  {
    label: '不重复',
    value: PlanType.NoRepeat
  },
  {
    label: '每日',
    value: PlanType.Daily
  },
  {
    label: '每周',
    value: PlanType.Weekly
  },
  {
    label: '每月',
    value: PlanType.Monthly
  }
]

export const WEEK_DAYS = [
  {
    label: '周一',
    value: '1'
  },
  {
    label: '周二',
    value: '2'
  },
  {
    label: '周三',
    value: '3'
  },
  {
    label: '周四',
    value: '4'
  },
  {
    label: '周五',
    value: '5'
  },
  {
    label: '周六',
    value: '6'
  },
  {
    label: '周日',
    value: '7'
  }
]

const buildDayOptions = () => {
  const options: { label: string; value: string }[] = []
  for (let i = 1; i <= 31; i++) {
    options.push({
      label: `${i}号`,
      value: i.toString()
    })
  }
  return options
}

export const MONTH_DAYS = buildDayOptions()
