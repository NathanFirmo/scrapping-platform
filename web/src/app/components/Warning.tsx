'use client'
import React from 'react'
import { Alert, Space } from 'antd'

const Warning: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Alert message="Warning text" banner />
  </Space>
)

export default Warning
