'use client'

import { ClockCircleFilled, ControlFilled } from '@ant-design/icons'
import { Button, Input } from 'antd'
import Title from 'antd/es/typography/Title'

export const WorkerConfig: React.FC = () => {
  return (
    <>
      <Title>Configurações do worker 🤖</Title>
      <Input
        style={{ margin: '16px auto' }}
        addonAfter={<ControlFilled />}
        defaultValue="mysite"
      />
      <Input addonAfter={<ClockCircleFilled />} defaultValue="mysite" />

      <div style={{ display: 'flex' }}>
        <Button style={{ margin: '16px auto' }} type="primary">
          Aplicar configurações
        </Button>
      </div>
    </>
  )
}
