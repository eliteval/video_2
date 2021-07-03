const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../../../config/logger')

exports.validateCMPActive = async (cmp, valueActive) => {

    const url = "https://200.48.13.39/cmp/php/detallexmedico.php?id=" + zfill(cmp, 6);
    logger.info('validateCMPActive url:', url);

    axios(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            let active = false;
            //logger.info(" " + $('#simple-example-table2').html());

            $('#simple-example-table2 > tbody > tr > th').each((index, element) => {
                if ($(element).text() == "ACTIVO") {
                    active = true;
                }
            });
            let photoCMP = null;
            if (active) {
                photoCMP = $('#simple-example-table2 > tbody > tr > td > img').attr('src');
                if (photoCMP != "fotos/00000.jpg") {
                    photoCMP = "https://200.48.13.39/cmp/php/" + photoCMP;
                }else{
                    photoCMP = "";
                }
            }
            /*console.log("active");
            console.log(active);
            console.log("photoCMP");
            console.log(photoCMP);*/
            valueActive(active, photoCMP);
        })
        .catch(e => {
            console.error(e);
            valueActive(true);
        });



};

function zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
        if (number < 0) {
            return ("-" + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString());
        }
    }
}