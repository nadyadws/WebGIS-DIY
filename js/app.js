let myObjek = {
    nama: "Malang",
    provinsi: "Jawa Timur",
    jumlahPenduduk: 400000,
    luasWilayah: 25.0,
    status: {
        kotaIstimewa: false,
        masaBerlaku: "2 tahun"
    },
    namaPenduduk: ["Budi", "Siti", "Andi", "Rina"],
};

console.log(myObjek["jumlahPenduduk"]);

function myFunction() {
    console.log("ini adalah fungsi");
    console.log("Ini adalah function uji coba");
    console.log("oke....");
    alert("halo...look at me");
};


function callMyName(name, age) {
    console.log("Hello my name is " + name + ", I am " + age + " years old.");
}

callMyName("Budi", 25);
callMyName("Felya", 60);


let map = L.map("map").setView([-7.7956, 110.3695], 10);
let geojsonData = null;
let wilayahLayer = null;
let selectedLayer = null;


let openTopoMap = L.tileLayer(
    "https://tile.opentopomap.org/{z}/{x}/{y}.png",
    {
        attribution:
            'Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenTopoMap'
    }
).addTo(map);

let openStreetMap = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            'Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenTopoMap'
    }
).addTo(map);

fetch("data/diy-demografi.geojson")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        geojsonData = data;
        wilayahlayer = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: feature.properties.stroke,
                    fillColor: feature.properties.fill,
                    weight: 2,
                    fillOpacity: 0.5
                };
            },
            onEachFeature: function (feature, layer) {
                let informasi = `
                <div class="popup-content">

                    <div
                        class="popup-header"
                        style="border-left-color: ${feature.properties.fill};"
                    >
                        <h3>${feature.properties.nama}</h3>
                        <span>Informasi Wilayah</span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label">Jumlah Penduduk</span>
                        <strong>${feature.properties.jumlah_penduduk} jiwa</strong>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label">Luas Wilayah</span>
                        <strong>${feature.properties.luas_wilayah_km2} km²</strong>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label">Kepadatan Penduduk</span>
                        <strong>${feature.properties.kepadatan} jiwa/km²</strong>
                    </div>

                </div>

                `;
                layer.bindPopup(informasi);
            }
        }).addTo(map);

        geojsonData.features.forEach(function (feature) {
            let option = document.createElement("option");
            option.value = feature.properties.nama;
            option.textContent = feature.properties.nama;
            wilayahSelect.appendChild(option);
        });

        wilayahSelect.addEventListener("change", function () {
            let selectedName = wilayahSelect.value;

            let selectedFeature = geojsonData.features.find(function (feature) {
                return feature.properties.nama === selectedName;
            });

            if (selectedLayer) {
                map.removeLayer(selectedLayer);
            }

            selectedLayer = L.geoJSON(selectedFeature, {
                style: function (feature) {
                    return {
                        color: feature.properties.stroke,
                        fillColor: feature.properties.fill,
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    };
                },
                onEachFeature: function (feature, layer) {
                    let informasi = `
                <div class="popup-content">

                    <div
                        class="popup-header"
                        style="border-left-color: ${feature.properties.fill};"
                    >
                        <h3>${feature.properties.nama}</h3>
                        <span>Informasi Wilayah</span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label">Jumlah Penduduk</span>
                        <strong>${feature.properties.jumlah_penduduk} jiwa</strong>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label">Luas Wilayah</span>
                        <strong>${feature.properties.luas_wilayah_km2} km²</strong>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label">Kepadatan Penduduk</span>
                        <strong>${feature.properties.kepadatan} jiwa/km²</strong>
                    </div>

                </div>

                `;
                    layer.bindPopup(informasi);
                }

            }).addTo(map);

            map.fitBounds(selectedLayer.getBounds());

            console.log(selectedFeature);
        });

        let baseMaps = {
            "OpenTopoMap": openTopoMap,
            "OpenStreetMap": openStreetMap,
        };

        let overlays = {
            "Wilayah Kabupaten/Kota": wilayahlayer,
        };

        L.control.layers(
            baseMaps,
            overlays,
        ).addTo(map);
    });


let tombolPeta = document.getElementById("btn-peta");
let mapElement = document.getElementById("map");
let mapPlaceholder = document.getElementById("map-placeholder");
let wilayahSelect = document.getElementById("wilayah-select");

