import {
  ActionIcon,
  Button,
  Chip,
  Fieldset,
  Input,
  Modal,
  NavLink,
  Notification,
  Paper,
  Select,
  Table,
  createTheme,
} from '@mantine/core';

export const theme = createTheme({
  autoContrast: true,
  colors: {
    // Colors sourced from https://www.nordtheme.com/docs/colors-and-palettes
    // Shades generated with https://mantine.dev/colors-generator/ with some alterations
    slate: [
      '#8F95A1',
      '#7D8595',
      '#757D8F',
      '#636B7D',
      '#575F70',
      '#485265',
      '#4C566A',
      '#434C5E',
      '#3B4252',
      '#2E3440',
    ],
    snow: [
      '#ECEFF4',
      '#E5E9F0',
      '#D8DEE9',
      '#C0C9D8',
      '#9EABC3',
      '#8192B1',
      '#6E82A7',
      '#657AA2',
      '#54688F',
      '#495C81',
      '#3B5074',
    ],
    dew: [
      '#E4FAFA',
      '#DAEFEF',
      '#BEDBDA',
      '#9CC5C4',
      '#8FBCBB',
      '#6EA9A7',
      '#63A3A2',
      '#508F8E',
      '#427F7E',
      '#2D6E6F',
    ],
    cyprus: [
      '#E5F9FF',
      '#D8EEF5',
      '#B6D9E4',
      '#88C0D0',
      '#71B3C5',
      '#5CA7BD',
      '#4FA2B9',
      '#3D8DA4',
      '#2F7E93',
      '#126E82',
    ],
    arctic: [
      '#E7F7FF',
      '#DBE8F4',
      '#BACDE1',
      '#96B2CD',
      '#81A1C1',
      '#648BB3',
      '#5884AF',
      '#48719A',
      '#3B658C',
      '#2B587D',
    ],
    ocean: [
      '#EDF4FF',
      '#DDE7F3',
      '#BCCCDE',
      '#99AFCA',
      '#7B97B9',
      '#6888AF',
      '#5E81AC',
      '#4C6E97',
      '#416189',
      '#31557A',
    ],
    blush: [
      '#FFECEF',
      '#F7DBDE',
      '#E5B7BB',
      '#D39097',
      '#C57078',
      '#BF616A',
      '#B94F5A',
      '#A43F4A',
      '#933741',
      '#822C36',
    ],
    sunset: [
      '#FFEFE9',
      '#F8E0D7',
      '#E8BFB2',
      '#DA9D8A',
      '#D08770',
      '#C66D51',
      '#C36445',
      '#AD5336',
      '#9B482F',
      '#893C25',
    ],
    beach: [
      '#FFF7E4',
      '#FAEDD3',
      '#F0D9A9',
      '#EBCB8B',
      '#E1B255',
      '#DDA73C',
      '#DBA12D',
      '#C28C1F',
      '#AD7C17',
      '#966A09',
    ],
    sage: [
      '#F1FAE9',
      '#E5EFDD',
      '#CBDBBD',
      '#AFC79B',
      '#A3BE8C',
      '#89AC6B',
      '#80A661',
      '#6E9150',
      '#608245',
      '#517037',
    ],
    marionberry: [
      '#FFF0FB',
      '#F0E1ED',
      '#D9C2D5',
      '#C2A2BD',
      '#B48EAD',
      '#A3749A',
      '#9E6B95',
      '#895A81',
      '#7C4E74',
      '#6D4166',
    ],
  },
  components: {
    ActionIcon: ActionIcon.extend({
      classNames: {
        root: 'gacgActionIcon',
      },
      vars: (_, props) => {
        if (!props.variant) {
          return {
            root: {
              '--ai-hover': 'var(--gacg-color-cyprus-highlight)',
            },
          };
        }

        return { root: {} };
      },
    }),
    Button: Button.extend({
      vars: (_, props) => {
        if (!props.variant && !props.color) {
          return {
            root: {
              '--button-hover': 'var(--gacg-color-cyprus-highlight)',
            },
          };
        }

        if (props.variant === 'subtle') {
          return {
            root: {
              '--button-hover': 'var(--gacg-color-slate-highlight)',
              '--button-hover-color': 'var(--gacg-color-white)',
            },
          };
        }

        return { root: {} };
      },
    }),
    Chip: Chip.extend({
      classNames: {
        label: 'gacgChipLabel',
      },
    }),
    Fieldset: Fieldset.extend({
      styles: {
        root: {
          backgroundColor: 'var(--gacg-color-body)',
          borderColor: 'var(--mantine-color-slate-6)',
        },
      },
    }),
    Input: Input.extend({
      classNames: {
        input: 'gacgInput',
        section: 'gacgInputSection',
      },
      styles: {
        input: {
          backgroundColor: 'var(--mantine-color-slate-8)',
          borderColor: 'var(--mantine-color-slate-6)',
        },
      },
    }),
    Modal: Modal.extend({
      classNames: {
        close: 'gacgModalCloseButton',
      },
    }),
    NavLink: NavLink.extend({
      classNames: {
        root: 'gacgNavLink',
      },
    }),
    Notification: Notification.extend({
      styles: {
        root: { backgroundColor: 'var(--mantine-color-slate-8)' },
      },
    }),
    Paper: Paper.extend({
      styles: {
        root: { borderColor: 'var(--mantine-color-slate-6)' },
      },
    }),
    Select: Select.extend({
      classNames: {
        groupLabel: 'gacgSelectGroupLabel',
        option: 'gacgSelectOption',
      },
      styles: {
        dropdown: {
          backgroundColor: 'var(--mantine-color-slate-8)',
          borderColor: 'var(--gacg-color-border)',
        },
      },
    }),
    Table: Table.extend({
      styles: {
        table: { '--table-border-color': 'var(--mantine-color-slate-6)' },
      },
    }),
  },
  cursorType: 'pointer',
  primaryColor: 'cyprus',
  primaryShade: 3,
});
