class Node {
  constructor(page, value) {
    this.page = page;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export default {
  LRUCache: class LRUCache {
    constructor(capacity) {
      this.capacity = capacity;
      this.cache = new Map();
      this.head = null;
      this.tail = null;
    }

    get(page) {
      if (!this.cache.has(page)) {
        return -1;
      }
      const node = this.cache.get(page);
      this.moveToHead(node);
      return node.value;
    }

    put(page, value) {
      if (this.cache.has(page)) {
        const node = this.cache.get(page);
        node.value = value;
        this.moveToHead(node);
      } else {
        const node = new Node(page, value);
        if (this.cache.size >= this.capacity) {
          this.removeTail();
        }
        if (!this.head) {
          this.head = node;
          this.tail = node;
        } else {
          node.next = this.head;
          this.head.prev = node;
          this.head = node;
        }
        this.cache.set(page, node);
      }
    }

    moveToHead(node) {
      if (node === this.head) {
        return;
      } else if (node === this.tail) {
        this.tail = node.prev;
        this.tail.next = null;
      } else {
        node.prev.next = node.next;
        node.next.prev = node.prev;
      }
      node.next = this.head;
      this.head.prev = node;
      node.prev = null;
      this.head = node;
    }

    removeTail() {
      if (!this.tail) {
        return;
      }
      this.cache.delete(this.tail.page);
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
      } else {
        this.tail = this.tail.prev;
        this.tail.next = null;
      }
    }

    getHead() {
      return this.head;
    }

    getTail() {
      return this.tail;
    }
  },

  linklist: class linklist {
    constructor() {
      this.item = 0; //头结点显示当前列表长度
      this.next = null;
    }
    length() {
      return this.item;
    }
    //在链表末尾添加结点
    append(item) {
      let cur_p = this;
      while (cur_p.next != null) {
        cur_p = cur_p.next;
      }
      //此时到达最后一个结点中
      cur_p.next = new linklist();
      cur_p.next.item = item;
      this.item++; //链表长度+1
    }
    //删除链表末尾结点——返回被删除的结点的内容
    deleteLast() {
      if (this.length() == 0) {
        return;
      }
      let cur_p = this;
      while (cur_p.next.next != null) {
        cur_p = cur_p.next;
      }
      //此时到达倒数第二个结点
      let item_delete = cur_p.next.item;
      cur_p.next = null;
      this.item--;
      return item_delete;
    }
    //寻找元素是否在链表中，若存在则返回相应位置（头结点位置为0），若不存在则返回-1
    findIndex(item) {
      let cur_p = this.next;
      for (let i = 1; cur_p != null; ++i) {
        if (cur_p.item == item) {
          return i;
        }
        cur_p = cur_p.next;
      }
      return -1;
    }
    //将指定位置元素移至链表头（头结点后第一个）——成功返回true，失败返回false
    movetoHead(index) {
      if (index > this.length() || index == 0) {
        return false;
      }
      let cur_p = this;
      for (let i = 0; i < index - 1; i++) {
        cur_p = cur_p.next;
      }
      //此时到达要移动的结点的前一个结点处
      let tem = cur_p.next; //要移动的结点
      cur_p.next = tem.next;
      tem.next = this.next;
      this.next = tem;
      return true;
    }
    //在链表首位插入元素
    insertHead(item) {
      let tmp = this.next;
      this.next = new linklist();
      this.next.item = item;
      this.next.next = tmp;
      this.item++;
    }
  },
};
