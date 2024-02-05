import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactAudioPlayer from 'react-audio-player';

const Quiz = () =>{
    const navigate = useNavigate();

    const [questions, setQuestions] = useState();
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [nama, setUser] = useState("");
    const [score, setScore] = useState();
    const [allScores, setAllScores] = useState([]);

    const arraySize = 4;
    const array = Array.from({ length: arraySize }, (_, index) => index);
    const initializedRef = useRef(false);
    const iRef = useRef(0);

    const user = localStorage.getItem('user');
    // const nama = JSON.parse(user);
    
    useEffect(() => {
        getAllPrevScore();
    }, []);

    const getAllPrevScore = async () => {
        const response = await axios.get("http://localhost:3001/scores?_sort=id&_order=desc&_limit=5");
        setAllScores(response.data);
        console.log(allScores);
    };


    const start = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/scores", {
            nama: nama,
            score: score
          });

          const data = response.data;

          console.log(data);
          if (data.id) { 
            const data = JSON.stringify(response.data);
            console.log(data);
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('pemain', data);
            } else {
              localStorage.clear();
              localStorage.setItem('pemain', data);
            }
            navigate("/quiz");
          } else {
            console.log("Login failed");
          }
          
        } catch (error) {
          console.error("Error logging in", error);
        }
      };
      
    
    return (
        <section className="bg-white-50 dark:bg-white-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-gray">
            Kuis Tebak Lagu Daerah
            </div> 
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-100 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <div className="grid grid-cols-2	">
                  <div className="h-min inline-block mt-10">
                    <h1 className=" text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray">
                        Masukkan nama
                    </h1>
                      <form className="space-y-4 md:space-y-6" onSubmit={start}>
                          <div>
                              <input 
                              type="text"
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-200 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              value={nama}
                              onChange={(e) => setUser(e.target.value)}
                              placeholder="name"/>
                          </div>
                          <button type="submit" className="w-full text-white bg-gray-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Mulai Kuis</button>
                      </form>
                  </div>
                  <div>
                    { allScores && (
                      <>
                        <div className="table-auto p-4 bg-blue-200 ml-5 p-5">
                          <thead>
                            <tr>
                              <th className="p-3">Nama</th>
                              <th className="p-3">Score</th>
                            </tr>
                          </thead>
                          {allScores?.map((score) =>(
                          <tbody>
                            <tr key={score.id}>
                              <td className="text-center">{score.nama}</td>
                              <td className="text-center">{score.score}</td>
                            </tr>
                          </tbody>
                          ))}
                        </div>
                      </>
                      )}
                  </div>  
                  </div>
                </div>
              
            </div>
        </div>
      </section>
    );
};
    
export default Quiz;