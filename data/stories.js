import STORY_1 from '../assets/images/story.jpeg'
import STORY_2 from '../assets/images/story2.jpeg'
import STORY_3 from '../assets/images/story3.jpeg'
import STORY_4 from '../assets/images/story4.jpeg'
import STORY_5 from '../assets/images/story5.jpeg'

export default usersStories = [
  {
    userId: 1,
    username: 'user1',
    stories: [
      {
        uri: STORY_1,
      },
      {
        uri: STORY_2,
      },
      {
        uri: STORY_5,
      },
    ],
  },
  {
    userId: 2,
    username: 'user2',
    stories: [
      {
        uri: STORY_3,
      },
      { uri: STORY_4 },
    ],
  },
  {
    userId: 3,
    username: 'user3',
    stories: [
      {
        uri: STORY_5,
      },
    ],
  },
]
