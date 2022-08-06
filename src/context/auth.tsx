import { onAuthStateChanged } from '@firebase/auth'
import { doc, getDoc, setDoc } from '@firebase/firestore'
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useContext
} from 'react'
import { auth, db } from '../firebase/client'
import { User } from '../types/user'

// コンテクスト用の型を定義
// コンテクストとは
// Reactの機能で、複数のコンポーネント間でデータを共有したいときに使われる
// 作成・共有・注文の３つのAPIで成立
type UserContextType = User | null | undefined

// コンテクストを作成
//createContext<型>(初期値)
const AuthContext = createContext<UserContextType>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ユーザ情報のデータの定義
  // ReactNode：明示的に children の型情報を指定（childrenしゃってもいるよーっていう型）
  const [user, setUser] = useState<UserContextType>()

  useEffect(() => {
    // authオブジェクトでログイン状態を監視し、変化があったら発動
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ログインしていた場合、ユーザーコレクションからユーザーデータを参照
        const ref = doc(db, `users/${firebaseUser.uid}`)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          // ユーザーデータを取得して格納
          const appUser = (await getDoc(ref)).data() as User
          setUser(appUser)
        } else {
          // ユーザーが未作成の場合、新規作成して格納
          const appUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName!,
            photoURL: firebaseUser.photoURL!,
            email: firebaseUser.email!,
            createdAt: Date.now()
          }

          // Firestoreにユーザーデータを保存
          setDoc(ref, appUser).then(() => {
            // 保存に成功したらコンテクストにユーザーデータを格納
            setUser(appUser)
          })
        }
      } else {
        // ログインしていない場合、ユーザー情報を空にする
        setUser(null)
      }

      // このコンポーネントが不要になったら監視を終了する
      return unsubscribe
    })
  }, [])

  // プロバイダーを作成し、配布物を格納する
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

// コンテクストを受け取るメソッドを定義
// useContext
// Component treeのどの階層であっても、propsによる値の引き渡しを行うことなく、Grobalにデータの共有を行うことが出来る
// TODO:recoilで置き換える
export const useAuth = () => useContext(AuthContext)
