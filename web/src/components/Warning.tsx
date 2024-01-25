import React from 'react'
import { Alert, Space } from 'antd'

interface WarningProps {
  text: string
}

export const Warning: React.FC<WarningProps> = ({ text }: WarningProps) => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Alert message={text} banner />
  </Space>
)
