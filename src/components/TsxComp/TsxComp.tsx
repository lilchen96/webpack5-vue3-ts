import { defineComponent, ref } from 'vue';
import './index.css';
export default defineComponent({
  name: 'TsxComp',
  setup() {
    const count = ref(0);
    return {
      count
    };
  },
  render() {
    return (
      <div class="tsx-comp">
        <button onClick={() => this.count++}>
          tsx_
          {this.count}
        </button>
      </div>
    );
  }
});
