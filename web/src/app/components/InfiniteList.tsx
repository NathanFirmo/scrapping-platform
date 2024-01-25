'use client'
import React, { useEffect, useState } from 'react'
import VirtualList from 'rc-virtual-list'
import { Avatar, List } from 'antd'

interface UserItem {
  email: string
  gender: string
  name: {
    first: string
    last: string
    title: string
  }
  nat: string
  picture: {
    large: string
    medium: string
    thumbnail: string
  }
}

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo'
const ContainerHeight = 400

const InfiniteList: React.FC = () => {
  const [data, setData] = useState<UserItem[]>([])

  const appendData = () => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData(data.concat(body.results))
      })
  }

  useEffect(() => {
    appendData()
  }, [])

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData()
    }
  }

  return (
    <List
      style={{
        padding: 16,
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
        borderRadius: 8,
      }}
    >
      <VirtualList
        data={data}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="email"
        onScroll={onScroll}
      >
        {(item: UserItem) => (
          <List.Item key={item.email}>
            <List.Item.Meta
              title={<a href="https://ant.design">{item.name.last}</a>}
              description={item.email}
            />
          </List.Item>
        )}
      </VirtualList>
    </List>
  )
}

export default InfiniteList
