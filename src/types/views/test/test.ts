import { Component, Vue } from "vue-property-decorator"
import { Getter, Action } from "vuex-class"
import { TestData, Car } from '@/types/views/test.interface'

@Component({})
export default class About extends Vue {

  // test Record
  cars: Record<Car, { age: number }> = {
    Audi: { age: 119 },
    BMW: { age: 113 },
    MercedesBenz: { age: 133 },
  }

  // test union
  formatCommandline(command: string[] | string): string {
    let line = ''
    if (typeof command === 'string') {
      line = command.trim()
    } else {
      line = command.join(' ').trim()
    }
    return line
  }

  // data
  data: TestData = {
    pageName: 'test'
  }

  created() {
    //
  }

  activated() {
    //
  }

  mounted() {
    //
  }

}
