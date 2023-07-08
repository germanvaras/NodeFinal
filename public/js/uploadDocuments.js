const form = document.getElementById("uploadForm");
const documentInput = document.getElementById("documentInput");

form.onsubmit = (e) => {
    e.preventDefault();
    submitForm(form.dataset.userId);
};

const submitForm = async (userId) => {
    const formData = new FormData();
    const files = documentInput.files;
    for (let i = 0; i < files.length; i++) {
        formData.append("document", files[i]);
    }

    try {
        const response = await fetch(`/api/user/${userId}/documents`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.status === "error") {
            alerts(data.status, data.payload);
        }
        if (data.status === "success") {
            alerts(data.status, data.payload);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}