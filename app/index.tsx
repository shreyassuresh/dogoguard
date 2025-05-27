import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../src/store';

export default function Index() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return <Redirect href={currentUser ? "/main" : "/auth"} />;
} 