import { render } from '@testing-library/react'
import { composeStories } from '@storybook/testing-react'

import * as stories from './MobileFooter.stories'

const { Primary } = composeStories(stories)

it('Renders without error', () => {
  render(<Primary />)
})
