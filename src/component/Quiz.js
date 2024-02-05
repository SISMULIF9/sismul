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
    const [score, setScore] = useState(0);

    const arraySize = 4;
    const array = Array.from({ length: arraySize }, (_, index) => index);
    const initializedRef = useRef(false);
    const iRef = useRef(0);

    const user = localStorage.getItem('user');
    const nama = JSON.parse(user);

    const selectRandomQuestion = async () => {
      //mengambil 10 random pertanyaan agar tidak ada pertanyaan yang sama
      
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      // const { ...arrayNumber} = array;
      // console.log(array);
      setAnsweredQuestions(array);
      console.log(answeredQuestions);
    }

    const getQuestion = async () => {
      if (iRef.current < array.length) {
        try {
          // console.log('get id ke  '+array[iRef.current]);
          // console.log(array)
          const response = await axios.get(`http://localhost:3001/questions?id=${array[iRef.current]}`);
          setQuestions(response.data);
          setSelectedAnswer(null);
          setCorrectAnswer(null);
          iRef.current++;
          // console.log(iRef.current);
        } catch (error) {
          console.error("Error logging in", error);
        }
      } else {
        iRef.current = 0;
        setAnsweredQuestions([]);
      }
    }

    useEffect(() => {
      if (!initializedRef.current) {
        initializedRef.current = true;
        return;
      }
      
      // selectRandomQuestion();
      getQuestion();
    }, []);

    const handleAnswerButtonClick = (choice) => {
      const isCorrect = choice === questions[0]?.answer;
      setSelectedAnswer({ choice, isCorrect });

      if (!isCorrect) {
        setCorrectAnswer({ choice: questions[0]?.answer, isCorrect: true });
      } else {
        setScore(score+10);
      }
    };

    const finishQuiz = async () => {
      // const 
      const getPemain = localStorage.getItem('pemain');
        if (getPemain === null) {
            return undefined;
        }
        const pemain = JSON.parse(getPemain);
        const playerId = parseInt(pemain.id);
        console.log( playerId);
        // if (pemain.id) {
          try {
            const change = await axios.patch(`http://localhost:3001/scores/${playerId}`, {
              score: score
            });
            navigate("/");
          } catch (error) {
            console.error("Error logging in", error);
          } 
        // }
    };

    const handleNextButtonClick = () => {
      getQuestion();
    };
    
    const handleFinishButtonClick = () => {
      const correctAnswersCount = questions.reduce(
        (count, question) =>
          question.choices.length > 0 &&
          question.answer === selectedAnswer.choice
            ? count + 1
            : count,
        0
      );

      setScore(Math.min(correctAnswersCount*10, 100));
      console.log(score);
      finishQuiz();
    };
    
    return (
      <section className="bg-white-50 dark:bg-white-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-gray">
                Kuis Tebak Lagu Daerah
            </div> 
            <div className="mb-5 max-w-fit bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-100 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div>
                          {questions?.map((question) =>(
                            <div key={question.id}>
                              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray">
                                {question.question}
                              </h1>
                              {question.audioSrc && (
                                <ReactAudioPlayer
                                  src={question.audioSrc}
                                  autoPlay controls
                                  // onPlay={(e) => console.log(e)}
                                  className="block w-full max-w-md mx-auto"
                                />
                              )}
                              {question.videoUrl && (
                                <div className="grid grid cols-2">
                                  <iframe className="m-0" width="380" height="240" src={question.videoUrl} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                                </div>
                                )}
                                <></>
                                <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"></p>
                                {question.choices.map((choice, index) => (
                                  // <li key={index}>{choice}</li>
                                  <div key={index}>
                                    <button
                                      onClick={() => handleAnswerButtonClick(choice)}
                                      type="submit" 
                                      className={`w-full mb-1 text-black ${
                                        selectedAnswer?.choice === choice
                                        ? selectedAnswer.isCorrect
                                          ? "bg-green-400"
                                          : "bg-red-400"
                                        : correctAnswer?.choice === choice
                                        ? "bg-green-400"
                                        : "bg-gray-200"
                                      } hover:bg-blue-30 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-00 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                                      disabled={selectedAnswer !== null}
                                    >{choice}</button>
                                  </div>
                                  ))}
                            </div>
                          ))}
                        </div>
                        <button type="submit" onClick={handleNextButtonClick} className="w-full text-white bg-gray-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Next</button>
                        <button type="submit" onClick={handleFinishButtonClick} className="w-full text-white bg-gray-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Selesai</button>
                </div>
            </div>
        </div>
      </section>
    );
};
    
export default Quiz;