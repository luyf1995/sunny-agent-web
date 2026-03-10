// SSE 事件类型
export enum ChatSSEEvent {
  /**
   * 执行阶段状态通知。
   * data: {"phase": "executing"}
   * 与 done/finish 区别：status 是开始信号，done 是结束信号。
   */
  Status = 'status',
  /**
   * 流式响应完全结束（前端终止 SSE 连接的信号）。
   *  data: {
   *    "session_id": str,       # 会话 ID
   *    "duration_ms": int,      # 本次请求总耗时（毫秒）
   *    "iterations": int,       # ReAct 循环实际执行轮数
   *    "is_degraded": bool,     # 是否触发熔断降级
   *    "token_usage": {...},    # token 用量汇总
   *    "error": bool            # 异常路径时为 True（可选字段，正常时不含）
   */
  Done = 'done',

  /**
   * 错误
   * {"message": "处理请求时发生错误，请稍后重试。"}
   */
  Error = 'error',

  /**
   * 主 Agent 的单步推理内容（LLM 的"内心独白"，非最终回答）。
   * 在每次 Think 阶段完成后推送；前端通常以折叠/灰色样式展示。
   * data: {
   *    "step": int,      # 当前 ReAct 循环步骤编号（从 0 开始）
   *    "content": str    # 本次推理文本
   * }
   */
  Thought = 'thought',

  /**
   * 上下文使用情况通知。
   * data: {"context_usage": {...}}  # 上下文用量详情（如 token 用量）
   */
  ContextUsage = 'context_usage',

  /**
   * 流式响应增量内容（前端实时展示的部分）。
   * data: {"delta": str}  # 增量文本内容
   */
  Delta = 'delta',

  /**
   * 工具调用开始
   */
  ToolCall = 'tool_call',
  /**
   * 工具调用结果
   */
  ToolResult = 'tool_result'
}
