import type { Meta, StoryObj } from '@storybook/react'
import { ExampleForm } from './ExampleForm'

const meta: Meta<typeof ExampleForm> = {
  title: 'Components/ExampleForm',
  component: ExampleForm,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ExampleForm>

export const Default: Story = {}

export const WithValues: Story = {
  render: () => <ExampleForm />,
}

