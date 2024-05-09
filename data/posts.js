import { USERS } from './users';

export const POSTS = [
  {
    image:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/posts/75f57d952c16f71eb840d8e14e6f59a3.jpg',
    user: USERS[0].username,
    likes: 1280,
    caption:
      'shoes are fresh to death i wonder when I will be able to get the new jordans who are not in store yet but I will get them soon',
    avatar: USERS[0].avatar,
    comments: [
      {
        user: 'user.1',
        comment:
          '🔥🔥🔥 woaw is there anyway I can find them ? #INLOVEWITDASNEAK',
      },
      {
        user: 'user.2',
        comment: '👀👀',
      },
    ],
  },
  {
    image:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/posts/convers.jpeg',
    user: USERS[1].username,
    likes: 198,
    caption: 'shoes are fresh to death',
    avatar: USERS[1].avatar,
    comments: [
      {
        user: 'user.1',
        comment:
          '❄️❄️❄️ them shoes are cold as ice bro ! #SNEAKERS #FRESH #COLD',
      },
      {
        user: 'user.2',
        comment: '👀👀',
      },
    ],
  },
  {
    image:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/posts/jordan-andrews.jpeg',
    user: USERS[2].username,
    likes: 1428,
    caption: 'shoes are fresh to death',
    avatar: USERS[2].avatar,
    comments: [
      {
        user: 'user.1',
        comment: '🔥🔥🔥',
      },
      {
        user: 'user.2',
        comment: '👀👀',
      },
    ],
  },
  {
    image:
      '/Users/Estime/Desktop/private/react_native/sneakers/assets/posts/nike_cosmo.jpeg',
    user: USERS[3].username,
    likes: 4128,
    caption: 'shoes are fresh to death',
    avatar: USERS[3].avatar,
    comments: [
      {
        user: 'user.1',
        comment: '🔥🔥🔥',
      },
      {
        user: 'user.2',
        comment: '👀👀',
      },
    ],
  },
];
