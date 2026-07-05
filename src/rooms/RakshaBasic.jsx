export default function RoomSD({

    nextRoom,
    pin,
    setPin,
    score,
    setScore

}){

    return(

        <>

            <a-sky color="#05131f"/>

            <a-box
                class="clickable"
                color="blue"
                position="0 1 -3"

                onClick={()=>{
                    setScore(score+100);
                    nextRoom();
                }}
            />

        </>

    )

}