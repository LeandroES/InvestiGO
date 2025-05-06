class BDMock {



}
const USE_BD_MOCK = false;


const SheetsDB = USE_BD_MOCK ? new BDMock() : InvestiGoSheetDB;
