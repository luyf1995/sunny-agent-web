import { PlanType, WEEK_DAYS } from './utils'

export interface PlanToCronParams {
  planType: PlanType
  time: string
  weekDay?: string[]
  monthDay?: string[]
  date?: string
}
export interface CronToPlanResult {
  planType: PlanType
  time: string
  weekDay: string[]
  monthDay: string[]
  date: string
}

/**
 * 计划类型转换为Cron表达式
 * @param {PlanToCronParams} params 计划类型转换参数
 * @returns Cron表达式
 */
export const planToCron = (params: PlanToCronParams): string => {
  const { planType, time, weekDay = [], monthDay = [], date } = params

  const [hour = '0', minute = '0'] = time.split(':')

  switch (planType) {
    case PlanType.NoRepeat: {
      if (!date) return ''
      const [year, month, day] = date.split('-')
      return `${minute} ${hour} ${day} ${month} *`
    }

    case PlanType.Daily: {
      return `${minute} ${hour} * * *`
    }

    case PlanType.Weekly: {
      const cronWeekDays = weekDay.map(day => {
        const dayNum = parseInt(day, 10)
        return dayNum === 7 ? '0' : day
      })
      return `${minute} ${hour} * * ${cronWeekDays.join(',')}`
    }

    case PlanType.Monthly: {
      return `${minute} ${hour} ${monthDay.join(',')} * *`
    }

    default:
      return ''
  }
}

/**
 * Cron表达式转换为计划类型
 * @param {string} cron Cron表达式 (分钟 小时 日期 月份 星期)
 * @returns 计划类型转换结果
 */
export const cronToPlan = (cron: string): CronToPlanResult => {
  const defaultResult: CronToPlanResult = {
    planType: PlanType.Daily,
    time: '09:00',
    weekDay: [],
    monthDay: [],
    date: ''
  }

  if (!cron) return defaultResult

  const parts = cron.trim().split(/\s+/)
  if (parts.length < 5) return defaultResult

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
  const time = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`

  if (dayOfWeek !== '*') {
    const weekDays = dayOfWeek.split(',').map(d => {
      const dayNum = parseInt(d, 10)
      return dayNum === 0 ? '7' : d
    })
    return {
      planType: PlanType.Weekly,
      time,
      weekDay: weekDays,
      monthDay: [],
      date: ''
    }
  }

  if (dayOfMonth !== '*') {
    if (month !== '*') {
      const dateStr = `2026-${month.padStart(2, '0')}-${dayOfMonth.padStart(2, '0')}`
      return {
        planType: PlanType.NoRepeat,
        time,
        weekDay: [],
        monthDay: [],
        date: dateStr
      }
    }
    return {
      planType: PlanType.Monthly,
      time,
      weekDay: [],
      monthDay: dayOfMonth.split(','),
      date: ''
    }
  }

  return {
    planType: PlanType.Daily,
    time,
    weekDay: [],
    monthDay: [],
    date: ''
  }
}

/**
 * 格式化Cron表达式为可读计划
 * @param {string} cron Cron表达式 (分钟 小时 日期 月份 星期)
 * @returns 可读计划字符串
 */
export const formatCronDisplay = (cron: string): string => {
  if (!cron) return ''

  const plan = cronToPlan(cron)
  const { planType, time, weekDay, monthDay, date } = plan

  switch (planType) {
    case PlanType.Daily:
      return `每天 ${time}`

    case PlanType.Weekly: {
      const dayNames = weekDay.map(d => WEEK_DAYS.find(wd => wd.value === d)?.label || d).join('、')
      return `每周 ${dayNames} ${time}`
    }

    case PlanType.Monthly: {
      const dayNames = monthDay.map(d => `${d}号`).join('、')
      return `每月${dayNames} ${time}`
    }

    case PlanType.NoRepeat: {
      if (!date) return ''
      const [year, month, day] = date.split('-')
      return `${year}年${parseInt(month, 10)}月${parseInt(day, 10)}日 ${time}`
    }

    default:
      return ''
  }
}
