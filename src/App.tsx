import React from 'react';
import { supabase } from './supabaseClient'
import { useEffect } from 'react'
import Board from './Board'

import './App.css';

function App() {

  useEffect(() => {
    const signInGuest = async () => {
      try {
        //Check if a session already exists 
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {

          const { error } = await supabase.auth.signInAnonymously()

          if (error) {
            console.error("Failed to sign in anonymously: ", error.message)
          }
          else {
            console.log("Guest session created successfuly")
          }
        
        }
        else {
          console.log("Existing session found, skipping sign in")
        }
      } catch (err) {
        console.error("Unexpected error during guest sign in: ", err)
      }
    }
      
  signInGuest()
  }, []) //Runs once on mount because dependency array is []

  return (
    <div>
      <Board />
    </div>
  );
}

export default App;
