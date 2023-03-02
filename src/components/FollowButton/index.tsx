import React from 'react'
import { useSelector } from 'react-redux'
import { stateSubscribe, subscribe } from '../../redux/slices/userSlice'
import { RootState, useAppDispatch } from '../../redux/store'
import { userType } from '../../types'

export default function FollowButton({info}:{info: userType | null}) {
  const dispatch = useAppDispatch()
  const me = useSelector((state: RootState) => state.user.me)

  React.useEffect(() => {
    const isSubscribed = info&&me ? me.follow.includes(info._id) : false;
    setSubscribed(isSubscribed);
  }, [info,me])
  
  const [subscribed, setSubscribed] = React.useState(false);
  
  function handleSubscribe() {
    dispatch(subscribe({ _id: info?._id, add: !subscribed }));
    dispatch(stateSubscribe({info,subscribed}));
    setSubscribed(!subscribed)
    
    
  }

  return <div className={`button ${subscribed ?  'button--outline' : ''}`} onClick={() => handleSubscribe()}>{subscribed ? 'Unfollow' : 'Follow'}</div>;
}
