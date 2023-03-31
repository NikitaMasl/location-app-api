import { parseNumber } from 'src/utils/parsers/parseNumber';
import { parseString } from 'src/utils/parsers/parseString';

const vars = {
    port: parseNumber(process.env.PORT, 8000),
    mongo: {
        url: parseString(process.env.MONGO_URL, ''),
    },
};

export default vars;
