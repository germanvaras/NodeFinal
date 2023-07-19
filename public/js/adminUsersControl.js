const deleteUser = async (uid) => {
    await fetch(`${window.location.protocol}//${window.location.host}/api/user/${uid}`, {
        method: "delete",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json())
        .then((data) => {
            if(data.status === "success"){
                alerts(data.status, data.payload)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);     
            }
            else{
                alerts(data.status, data.payload)
            }
        })
}
const changeRolUser = async (uid) => {
    await fetch(`${window.location.protocol}//${window.location.host}/api/user/premium/${uid}`, {
        method: "post",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json())
        .then((data) => {
            if(data.status === "success"){
                alerts(data.status, data.payload)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);  
            }
            else{
                alerts(data.status, data.payload) 
            }
        })
}