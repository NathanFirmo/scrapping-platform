import { ClockCircleFilled, ControlFilled } from '@ant-design/icons'
import { Button, Input } from 'antd'
import Title from 'antd/es/typography/Title'
import { useEffect, useState } from 'react'

interface WorkerConfigProps {
  url: string
  ws: WebSocket
}

export const WorkerConfig: React.FC<WorkerConfigProps> = ({
  url,
  ws
}: WorkerConfigProps) => {
  const [cronExpression, setCronExpression] = useState('')
  const [key, setKey] = useState('')

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((body) => {
        setKey(body.keyword)
        setCronExpression(body.cronExpression)
      })
  }, [])

  return (
    <>
      <Title>Configurações do worker 🤖</Title>
      <Input
        style={{ margin: '16px auto' }}
        addonAfter={<ControlFilled />}
        value={key}
        onChange={(e) => {
          setKey(e.target.value)
        }}
      />
      <Input
        addonAfter={<ClockCircleFilled />}
        value={cronExpression}
        onChange={(e) => {
          setCronExpression(e.target.value)
        }}
      />

      <div style={{ display: 'flex' }}>
        <Button
          style={{ margin: '16px auto' }}
          type="primary"
          onClick={() => {
            ws.send(
              JSON.stringify({
                event: 'worker-config-change',
                data: {
                  cron: cronExpression,
                  keyword: key,
                },
              })
            )
          }}
        >
          Aplicar configurações
        </Button>
      </div>
    </>
  )
}
