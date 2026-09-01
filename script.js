/* =========================================
   SISTEM INVENTARIS RUANGAN
   Penyimpanan menggunakan LocalStorage
========================================= */


/* =========================================
   AMBIL ELEMENT HTML
========================================= */

const inventarisForm =
    document.getElementById("inventarisForm");

const namaBarang =
    document.getElementById("namaBarang");

const kodeInventaris =
    document.getElementById("kodeInventaris");

const namaRuangan =
    document.getElementById("namaRuangan");

const jumlahBarang =
    document.getElementById("jumlahBarang");

const kondisiBarang =
    document.getElementById("kondisiBarang");

const editId =
    document.getElementById("editId");

const inventarisTable =
    document.getElementById("inventarisTable");

const emptyState =
    document.getElementById("emptyState");

const totalBarang =
    document.getElementById("totalBarang");

const barangBaik =
    document.getElementById("barangBaik");

const barangRusak =
    document.getElementById("barangRusak");

const searchInput =
    document.getElementById("searchInput");

const filterRuangan =
    document.getElementById("filterRuangan");

const filterKondisi =
    document.getElementById("filterKondisi");

const submitBtn =
    document.getElementById("submitBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const formTitle =
    document.getElementById("formTitle");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const exportBtn =
    document.getElementById("exportBtn");

const importBtn =
    document.getElementById("importBtn");

const importFile =
    document.getElementById("importFile");


/* =========================================
   LOCAL STORAGE
========================================= */

const STORAGE_KEY = "dataInventaris";


/*
    Mengambil data dari LocalStorage
*/

function getData() {

    const data =
        localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Data LocalStorage rusak:",
            error
        );

        return [];
    }
}


/*
    Menyimpan data ke LocalStorage
*/

function saveData(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =========================================
   SAAT HALAMAN DIBUKA
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        tampilkanData();

        updateDashboard();

        updateFilterRuangan();

        loadDarkMode();

    }
);


/* =========================================
   TAMBAH / EDIT DATA
========================================= */

inventarisForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const nama =
            namaBarang.value.trim();

        const kode =
            kodeInventaris.value.trim();

        const ruangan =
            namaRuangan.value.trim();

        const jumlah =
            Number(jumlahBarang.value);

        const kondisi =
            kondisiBarang.value;


        /* Validasi */

        if (
            nama === "" ||
            kode === "" ||
            ruangan === "" ||
            jumlah < 1 ||
            kondisi === ""
        ) {

            alert(
                "Mohon lengkapi semua data!"
            );

            return;
        }


        let data = getData();


        /* =================================
           MODE EDIT
        ================================= */

        if (editId.value !== "") {

            const id =
                Number(editId.value);


            const index =
                data.findIndex(
                    item => item.id === id
                );


            if (index !== -1) {

                data[index] = {

                    ...data[index],

                    namaBarang: nama,

                    kodeInventaris: kode,

                    namaRuangan: ruangan,

                    jumlahBarang: jumlah,

                    kondisiBarang: kondisi

                };

            }


            alert(
                "Data inventaris berhasil diperbarui!"
            );

        }


        /* =================================
           MODE TAMBAH
        ================================= */

        else {

            const dataBaru = {

                id: Date.now(),

                namaBarang: nama,

                kodeInventaris: kode,

                namaRuangan: ruangan,

                jumlahBarang: jumlah,

                kondisiBarang: kondisi

            };


            data.push(dataBaru);


            alert(
                "Data inventaris berhasil ditambahkan!"
            );

        }


        /* Simpan */

        saveData(data);


        /* Reset */

        resetForm();


        /* Refresh */

        tampilkanData();

        updateDashboard();

        updateFilterRuangan();

    }
);


/* =========================================
   TAMPILKAN DATA
========================================= */

function tampilkanData() {

    const data =
        getData();


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const ruangan =
        filterRuangan.value;


    const kondisi =
        filterKondisi.value;


    /*
        Filter data
    */

    const filteredData =
        data.filter(item => {

            const cocokSearch =

                item.namaBarang
                    .toLowerCase()
                    .includes(search)

                ||

                item.kodeInventaris
                    .toLowerCase()
                    .includes(search);


            const cocokRuangan =

                ruangan === ""
                ||
                item.namaRuangan === ruangan;


            const cocokKondisi =

                kondisi === ""
                ||
                item.kondisiBarang === kondisi;


            return (
                cocokSearch &&
                cocokRuangan &&
                cocokKondisi
            );

        });


    /* Bersihkan table */

    inventarisTable.innerHTML = "";


    /* Jika tidak ada data */

    if (filteredData.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    /* =================================
       BUAT ROW TABLE
    ================================= */

    filteredData.forEach(
        (item, index) => {

            const row =
                document.createElement("tr");


            /* Badge kondisi */

            let badgeClass = "";


            if (
                item.kondisiBarang === "Baik"
            ) {

                badgeClass =
                    "badge-baik";

            }

            else if (
                item.kondisiBarang ===
                "Rusak Ringan"
            ) {

                badgeClass =
                    "badge-ringan";

            }

            else {

                badgeClass =
                    "badge-berat";

            }


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(
                            item.namaBarang
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        item.kodeInventaris
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.namaRuangan
                    )}
                </td>

                <td>
                    ${item.jumlahBarang}
                </td>

                <td>

                    <span
                        class="badge ${badgeClass}"
                    >
                        ${escapeHTML(
                            item.kondisiBarang
                        )}
                    </span>

                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="action-btn edit-btn"
                            onclick="editData(${item.id})"
                        >
                            ✏️ Edit
                        </button>

                        <button
                            class="action-btn delete-btn"
                            onclick="hapusData(${item.id})"
                        >
                            🗑️ Hapus
                        </button>

                    </div>

                </td>

            `;


            inventarisTable.appendChild(row);

        }
    );

}


/* =========================================
   ESCAPE HTML
   Mencegah input HTML masuk ke halaman
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    const data =
        getData();


    /* Total semua barang */

    const total =
        data.reduce(
            (sum, item) =>
                sum + Number(item.jumlahBarang),
            0
        );


    /* Barang kondisi baik */

    const baik =
        data
            .filter(
                item =>
                    item.kondisiBarang ===
                    "Baik"
            )
            .reduce(
                (sum, item) =>
                    sum +
                    Number(item.jumlahBarang),
                0
            );


    /* Barang rusak */

    const rusak =
        data
            .filter(
                item =>
                    item.kondisiBarang ===
                    "Rusak Ringan"
                    ||
                    item.kondisiBarang ===
                    "Rusak Berat"
            )
            .reduce(
                (sum, item) =>
                    sum +
                    Number(item.jumlahBarang),
                0
            );


    totalBarang.textContent =
        total;

    barangBaik.textContent =
        baik;

    barangRusak.textContent =
        rusak;

}


/* =========================================
   EDIT DATA
========================================= */

function editData(id) {

    const data =
        getData();


    const item =
        data.find(
            item => item.id === id
        );


    if (!item) {

        alert(
            "Data tidak ditemukan!"
        );

        return;

    }


    /* Isi form */

    namaBarang.value =
        item.namaBarang;

    kodeInventaris.value =
        item.kodeInventaris;

    namaRuangan.value =
        item.namaRuangan;

    jumlahBarang.value =
        item.jumlahBarang;

    kondisiBarang.value =
        item.kondisiBarang;


    /* Set ID */

    editId.value =
        item.id;


    /* Ubah tampilan */

    formTitle.textContent =
        "✏️ Edit Data Inventaris";

    submitBtn.textContent =
        "💾 Update Data";

    cancelBtn.classList.remove(
        "hidden"
    );


    /* Scroll ke form */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================
   BATAL EDIT
========================================= */

cancelBtn.addEventListener(
    "click",
    function () {

        resetForm();

    }
);


/* =========================================
   RESET FORM
========================================= */

function resetForm() {

    inventarisForm.reset();

    editId.value = "";

    formTitle.textContent =
        "➕ Tambah Data Inventaris";

    submitBtn.textContent =
        "💾 Simpan Data";

    cancelBtn.classList.add(
        "hidden"
    );

}


/* =========================================
   HAPUS DATA
========================================= */

function hapusData(id) {

    const yakin =
        confirm(
            "Apakah Anda yakin ingin menghapus data ini?"
        );


    if (!yakin) {

        return;

    }


    let data =
        getData();


    data =
        data.filter(
            item => item.id !== id
        );


    saveData(data);


    alert(
        "Data berhasil dihapus!"
    );


    tampilkanData();

    updateDashboard();

    updateFilterRuangan();

}


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    function () {

        tampilkanData();

    }
);


/* =========================================
   FILTER RUANGAN
========================================= */

filterRuangan.addEventListener(
    "change",
    function () {

        tampilkanData();

    }
);


/* =========================================
   FILTER KONDISI
========================================= */

filterKondisi.addEventListener(
    "change",
    function () {

        tampilkanData();

    }
);


/* =========================================
   UPDATE FILTER RUANGAN
========================================= */

function updateFilterRuangan() {

    const data =
        getData();


    /*
        Ambil nama ruangan
        dan hilangkan duplikat
    */

    const ruanganList =
        [
            ...new Set(
                data.map(
                    item =>
                        item.namaRuangan
                )
            )
        ];


    /*
        Simpan pilihan sebelumnya
    */

    const selected =
        filterRuangan.value;


    filterRuangan.innerHTML = `

        <option value="">
            Semua Ruangan
        </option>

    `;


    ruanganList
        .sort()
        .forEach(ruangan => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                ruangan;

            option.textContent =
                ruangan;


            filterRuangan.appendChild(
                option
            );

        });


    /*
        Kembalikan pilihan
    */

    if (
        ruanganList.includes(selected)
    ) {

        filterRuangan.value =
            selected;

    }

}


/* =========================================
   DARK MODE
========================================= */

darkModeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            isDark
        );


        darkModeBtn.textContent =
            isDark ? "☀️" : "🌙";

    }
);


/* =========================================
   LOAD DARK MODE
========================================= */

function loadDarkMode() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark"
        );

        darkModeBtn.textContent =
            "☀️";

    }

}


/* =========================================
   EXPORT DATA
========================================= */

exportBtn.addEventListener(
    "click",
    function () {

        const data =
            getData();


        if (data.length === 0) {

            alert(
                "Belum ada data untuk diexport!"
            );

            return;

        }


        const json =
            JSON.stringify(
                data,
                null,
                4
            );


        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href =
            url;

        link.download =
            "backup-inventaris.json";


        link.click();


        URL.revokeObjectURL(url);

    }
);


/* =========================================
   IMPORT DATA
========================================= */

importBtn.addEventListener(
    "click",
    function () {

        importFile.click();

    }
);


/* =========================================
   PROSES FILE IMPORT
========================================= */

importFile.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (e) {

                try {

                    const importedData =
                        JSON.parse(
                            e.target.result
                        );


                    if (
                        !Array.isArray(
                            importedData
                        )
                    ) {

                        throw new Error(
                            "Format tidak valid"
                        );

                    }


                    /*
                        Berikan ID baru
                        agar tidak bentrok
                    */

                    const data =
                        importedData.map(
                            item => ({

                                id:
                                    item.id
                                    ||
                                    Date.now() +
                                    Math.random(),

                                namaBarang:
                                    item.namaBarang
                                    || "",

                                kodeInventaris:
                                    item.kodeInventaris
                                    || "",

                                namaRuangan:
                                    item.namaRuangan
                                    || "",

                                jumlahBarang:
                                    Number(
                                        item.jumlahBarang
                                    )
                                    || 1,

                                kondisiBarang:
                                    item.kondisiBarang
                                    || "Baik"

                            })
                        );


                    saveData(data);


                    tampilkanData();

                    updateDashboard();

                    updateFilterRuangan();


                    alert(
                        "Data berhasil diimport!"
                    );


                }

                catch (error) {

                    alert(
                        "File JSON tidak valid!"
                    );

                    console.error(error);

                }

            };


        reader.readAsText(file);


        /*
            Reset input file
            supaya file yang sama
            bisa diimport kembali
        */

        importFile.value = "";

    }
);


/* =========================================
   SERVICE WORKER
========================================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register(
                    "service-worker.js"
                )

                .then(
                    function (registration) {

                        console.log(
                            "Service Worker berhasil:",
                            registration.scope
                        );

                    }
                )

                .catch(
                    function (error) {

                        console.error(
                            "Service Worker gagal:",
                            error
                        );

                    }
                );

        }
    );

}
